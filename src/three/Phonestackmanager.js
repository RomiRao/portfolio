import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// ────────────────────────────────────────────────────────────────────────────
// Default mesh maps: which node names in the .gltf play which role.
// These match the phone model used in the POC (iphone.gltf). When you add a
// laptop model, create a new map with the node names from THAT file (open it
// in https://gltf-viewer.donmccurdy.com or inspect gltf.scene in the console
// to find them) and pass it as `meshMap` from the card that uses the laptop.
// ────────────────────────────────────────────────────────────────────────────
export const DEFAULT_PHONE_MESH_MAP = {
  hiddenMeshes: ["Object_7"],
  screenMeshName: "Object_17",
  tintMeshes: ["Object_4", "Object_9", "Object_8", "Object_6"],
  tintStrength: 0.95,
  sourceMaterialMesh: "Object_5",
  targetMaterialMeshes: ["Object_18", "Object_19"],
};

// Starting template for a future laptop model — adjust node names once you
// inspect the real file.
export const DEFAULT_LAPTOP_MESH_MAP = {
  hiddenMeshes: [],
  screenMeshName: "Screen",
  tintMeshes: [],
  tintStrength: 0.95,
  sourceMaterialMesh: null,
  targetMaterialMeshes: [],
};

// Exact same coordinates as the POC (index.html getDefaultPhoneSettings).
export const DEFAULT_PHONE_INSTANCE_SETTINGS = [
  {
    // Phone 1 (Primary)
    startPosX: -0.0259,
    endPosX: 0.0,
    startPosY: -0.4231,
    endPosY: -0.1111,
    startPosZ: 0.0,
    endPosZ: 0.0,
    startRotY: 2.6376,
    endRotY: 3.1416,
    startZoom: 1.7265,
    endZoom: 1.3286,
  },
  {
    // Phone 2 (Secondary)
    startPosX: 0.0535,
    endPosX: 0.0,
    startPosY: -0.3848,
    endPosY: -0.0667,
    startPosZ: -0.009,
    endPosZ: -0.05,
    startRotY: 3.6232,
    endRotY: 3.1416,
    startZoom: 1.2917,
    endZoom: 0.88,
  },
];

// Exact same coordinates as the POC (index.html getDefaultCamSettings).
export const DEFAULT_CAM_SETTINGS = {
  startCamPosX: 0.0,
  endCamPosX: 0.0,
  startCamPosY: -0.2152,
  endCamPosY: 0.0,
  startCamPosZ: 0.0,
  endCamPosZ: 0.0,
  startCamRotX: 0.0,
  endCamRotX: 0.0,
  startCamRotY: 0.0,
  endCamRotY: 0.0,
  startCamRotZ: 0.0,
  endCamRotZ: 0.0,
};

const RENDER_PIXEL_RATIO = () => Math.min(window.devicePixelRatio || 1, 2);

let renderer = null;
let canvas = null;
let pmrem = null;
let envTexture = null;
let listenersBound = false;

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const baseModelPromises = new Map(); // modelUrl -> Promise<{ baseModel, origColors, size, baseCamDist }>
const scenesById = new Map(); // id -> sceneData
const resizeObservers = new Map(); // id -> ResizeObserver
const viewerElements = new Map(); // id -> element (tracked independent of model-load completion)
const elementToId = new WeakMap(); // element -> id (for IO callback -> id lookup)
const visibleIds = new Set(); // ids currently intersecting (with rootMargin buffer)
let visibilityObserver = null;

const VISIBILITY_ROOT_MARGIN_PX = 200; // buffer so cards render slightly before entering view

function ensureRenderer() {
  if (renderer) return;

  canvas = document.createElement("canvas");
  canvas.id = "phone-stack-webgl-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "10",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(RENDER_PIXEL_RATIO());
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // Multiple independent scenes can share the exact same viewport rect (e.g.
  // the primary + secondary phone of one card). We do a single full-canvas
  // clear once per frame in animate() instead, so each individual
  // renderer.render() call must NOT clear on its own or it would wipe out
  // whatever the previous scene already drew in that same rect.
  renderer.autoClear = false;

  pmrem = new THREE.PMREMGenerator(renderer);
  envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  if (!listenersBound) {
    window.addEventListener("resize", handleWindowResize);
    listenersBound = true;
  }

  // Ride GSAP's own ticker instead of a separate requestAnimationFrame chain
  // so this runs in the same tick, after ScrollTrigger's scroll-driven
  // transforms land — otherwise the two independently-scheduled rAF loops
  // race and this can read a stale (pre-transform) element rect.
  gsap.ticker.add(animate);
}

function ensureVisibilityObserver() {
  if (visibilityObserver) return;
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = elementToId.get(entry.target);
        if (!id) return;
        if (entry.isIntersecting) visibleIds.add(id);
        else visibleIds.delete(id);
      });
    },
    { rootMargin: `${VISIBILITY_ROOT_MARGIN_PX}px 0px` },
  );
}

function handleWindowResize() {
  if (!renderer) return;
  renderer.setPixelRatio(RENDER_PIXEL_RATIO());
  renderer.setSize(window.innerWidth, window.innerHeight);
  scenesById.forEach(updateCameraAspect);
}

function updateCameraAspect(data) {
  const rect = data.element.getBoundingClientRect();
  const aspect = rect.width / rect.height || 1;
  data.camera.aspect = aspect;
  data.camera.updateProjectionMatrix();
}

// ─── Model loading (cached per URL, shared across every card using it) ───────
function loadBaseModel(modelUrl, hiddenMeshes, tintMeshes) {
  if (baseModelPromises.has(modelUrl)) return baseModelPromises.get(modelUrl);

  const promise = new Promise((resolve, reject) => {
    loader.load(
      modelUrl,
      (gltf) => {
        const baseModel = gltf.scene;
        const origColors = {};

        baseModel.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            obj.material.polygonOffset = true;
            obj.material.polygonOffsetFactor = 1;
            obj.material.polygonOffsetUnits = 1;
            if (tintMeshes.includes(obj.name)) {
              origColors[obj.name] = obj.material.color.clone();
            }
          }
        });

        hiddenMeshes.forEach((name) => {
          const obj = baseModel.getObjectByName(name);
          if (obj) obj.visible = false;
        });

        const box = new THREE.Box3();
        baseModel.traverse((obj) => {
          if (obj.isMesh && obj.geometry?.attributes?.position?.count > 10) {
            box.expandByObject(obj);
          }
        });
        const center = box.getCenter(new THREE.Vector3());
        const dims = box.getSize(new THREE.Vector3());
        baseModel.position.sub(center);

        const size = dims.length();
        const fovRad = 45 * (Math.PI / 180);
        const maxDim = Math.max(dims.x, dims.y, dims.z);
        const baseCamDist = (maxDim / 2 / Math.tan(fovRad / 2)) * 1.5;

        resolve({ baseModel, origColors, size, baseCamDist });
      },
      undefined,
      reject,
    );
  });

  baseModelPromises.set(modelUrl, promise);
  return promise;
}

// ─── Screen texture helpers ───────────────────────────────────────────────────
function createFallbackTexture({ bg, title, sub, isSecondary }, originalMap) {
  const c = document.createElement("canvas");
  c.width = originalMap?.image?.width || 512;
  c.height = originalMap?.image?.height || 1024;
  const ctx = c.getContext("2d");

  ctx.fillStyle = isSecondary ? "#f4f7f6" : bg || "#222";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = isSecondary ? "#1e293b" : "rgba(255,255,255,0.95)";
  ctx.font = `bold ${c.width * 0.08}px sans-serif`;
  ctx.fillText(title || "", c.width * 0.08, c.height * 0.12);

  ctx.font = `${c.width * 0.045}px sans-serif`;
  ctx.fillText(sub || "", c.width * 0.08, c.height * 0.17);

  const texture = new THREE.CanvasTexture(c);
  if (originalMap) {
    texture.flipY = originalMap.flipY;
    texture.wrapS = originalMap.wrapS;
    texture.wrapT = originalMap.wrapT;
  }
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createImageTexture(imageUrl, originalMap) {
  const texture = textureLoader.load(imageUrl, undefined, undefined, (err) =>
    console.error(`Failed to load screen image: ${imageUrl}`, err),
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if (originalMap) {
    texture.flipY = originalMap.flipY;
    texture.wrapS = originalMap.wrapS;
    texture.wrapT = originalMap.wrapT;
  }
  return texture;
}

// ─── Building one card's scene/camera/instances ───────────────────────────────
function buildScene(config, modelData) {
  const {
    id,
    groupId,
    element,
    meshMap,
    screens,
    bg,
    tint,
    title,
    sub,
    instanceSettings,
    camSettings,
    animState,
  } = config;
  const { baseModel, origColors, size, baseCamDist } = modelData;

  const scene = new THREE.Scene();
  scene.environment = envTexture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  const rad = THREE.MathUtils.degToRad(45);
  dirLight.position.set(
    Math.cos(rad) * size * 1.2,
    size * 0.6,
    Math.sin(rad) * size * 1.2,
  );
  scene.add(dirLight);

  const rect = element.getBoundingClientRect();
  const aspect = rect.width / rect.height || 1;
  const camera = new THREE.PerspectiveCamera(
    45,
    aspect,
    size / 100,
    size * 100,
  );
  camera.position.set(0, 0.05, baseCamDist);
  camera.rotation.order = "YXZ";

  const instances = instanceSettings.map((_, idx) => {
    const clone = baseModel.clone();
    // `isSecondary` used to be inferred from the index when one scene held
    // several instances. Now each PhoneMockup3D call registers a single
    // instance, so the caller states its fallback style explicitly.
    const isSecondary = config.isSecondary ?? idx > 0;

    const screenMesh = clone.getObjectByName(meshMap.screenMeshName);
    if (screenMesh?.isMesh && screenMesh.material) {
      screenMesh.material = screenMesh.material.clone();
      const screenImage = screens?.[idx];
      const screenTex = screenImage
        ? createImageTexture(screenImage, screenMesh.material.map)
        : createFallbackTexture(
            { bg, title, sub, isSecondary },
            screenMesh.material.map,
          );
      // A phone screen emits its own light rather than reflecting the
      // scene's studio lights — put the texture on the emissive channel
      // (not the diffuse map) and zero out the base color, so the
      // ambient/directional lights don't wash it out with extra
      // reflected light on top of what the screenshot already shows.
      screenMesh.material.map = null;
      screenMesh.material.color.set(0x000000);
      screenMesh.material.emissive.set(0xffffff);
      screenMesh.material.emissiveMap = screenTex;
      screenMesh.material.emissiveIntensity = 1;
      screenMesh.material.metalness = 0;
      screenMesh.material.roughness = 1;
      screenMesh.material.envMapIntensity = 0;
      // Show the screenshot's colors as authored, not run through the
      // scene's ACES tone-mapping curve (that's for lit surfaces, not a
      // UI screenshot being displayed on a "screen").
      screenMesh.material.toneMapped = false;
      screenMesh.material.needsUpdate = true;
    }

    meshMap.tintMeshes.forEach((name) => {
      const part = clone.getObjectByName(name);
      if (part?.isMesh && part.material && origColors[name] && tint) {
        part.material = part.material.clone();
        part.material.color
          .copy(origColors[name])
          .lerp(new THREE.Color(tint), meshMap.tintStrength ?? 0.95);
        part.material.needsUpdate = true;
      }
    });

    if (meshMap.sourceMaterialMesh) {
      const sourceObj = clone.getObjectByName(meshMap.sourceMaterialMesh);
      if (sourceObj?.material) {
        meshMap.targetMaterialMeshes.forEach((name) => {
          const part = clone.getObjectByName(name);
          if (part?.isMesh) {
            part.material = sourceObj.material.clone();
            part.material.needsUpdate = true;
          }
        });
      }
    }

    scene.add(clone);
    return clone;
  });

  return {
    id,
    groupId: groupId ?? id,
    scene,
    camera,
    baseCamDist,
    instances,
    element,
    instanceSettings,
    camSettings,
    animState,
  };
}

function disposeScene(data) {
  data.instances.forEach((instance) => {
    instance.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.();
        const materials = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        materials.forEach((mat) => {
          if (!mat) return;
          mat.map?.dispose?.();
          mat.dispose?.();
        });
      }
    });
    data.scene.remove(instance);
  });

  const observer = resizeObservers.get(data.id);
  if (observer) {
    observer.disconnect();
    resizeObservers.delete(data.id);
  }
}

// ─── Public API ────────────────────────────────────────────────────────────
export function registerViewer(config) {
  ensureRenderer();
  ensureVisibilityObserver();

  const { id, element, modelUrl, meshMap } = config;

  viewerElements.set(id, element);
  elementToId.set(element, id);
  visibilityObserver.observe(element);

  // Seed synchronously so a viewer that's already on-screen at registration
  // (e.g. the first card visible on initial load) isn't skipped for the one
  // or two frames before IntersectionObserver's async first callback lands.
  // IO's own callback will correct/confirm this immediately after.
  const seedRect = element.getBoundingClientRect();
  const margin = VISIBILITY_ROOT_MARGIN_PX;
  if (
    seedRect.bottom >= -margin &&
    seedRect.top <= window.innerHeight + margin &&
    seedRect.right >= -margin &&
    seedRect.left <= window.innerWidth + margin
  ) {
    visibleIds.add(id);
  }

  loadBaseModel(modelUrl, meshMap.hiddenMeshes, meshMap.tintMeshes).then(
    (modelData) => {
      // Component may have unmounted while the (possibly shared, cached) model
      // was loading — bail out if so.
      if (!element.isConnected) return;

      const sceneData = buildScene(config, modelData);
      scenesById.set(id, sceneData);

      const observer = new ResizeObserver(() => updateCameraAspect(sceneData));
      observer.observe(element);
      resizeObservers.set(id, observer);
    },
  );
}

export function unregisterViewer(id) {
  const data = scenesById.get(id);
  if (data) {
    disposeScene(data);
    scenesById.delete(id);
  }

  const element = viewerElements.get(id);
  if (element && visibilityObserver) visibilityObserver.unobserve(element);
  viewerElements.delete(id);
  visibleIds.delete(id);
}

// ─── Render loop (viewport-scissors each visible card, same as the POC) ─────
function animate() {
  if (!renderer || visibleIds.size === 0) return;

  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);

  // Tracks which groups (e.g. "one card's phone pair") have already gotten
  // their color clear this frame, so siblings sharing a viewport rect don't
  // erase each other, while a different card overlapping that same screen
  // region (sticky stacking) still gets a fresh clear and correctly covers
  // whatever the previous card drew there.
  const clearedGroupsThisFrame = new Set();

  scenesById.forEach((data) => {
    if (!visibleIds.has(data.id)) return;

    const rect = data.element.getBoundingClientRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = window.innerHeight - rect.bottom;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);

    if (clearedGroupsThisFrame.has(data.groupId)) {
      // A sibling in this same group already cleared+drew this rect —
      // only reset depth so this instance's occlusion is correct without
      // wiping the sibling's pixels.
      renderer.clearDepth();
    } else {
      // First scene for this group this frame: full clear scoped to the
      // scissor rect, so any bleed from a previous (different) group that
      // overlapped this same screen region gets wiped.
      renderer.clear(true, true, true);
      clearedGroupsThisFrame.add(data.groupId);
    }

    const p = data.animState.progress;

    data.instances.forEach((instance, idx) => {
      const cfg = data.instanceSettings[idx] || data.instanceSettings[0];
      instance.position.set(
        cfg.startPosX * (1 - p) + cfg.endPosX * p,
        cfg.startPosY * (1 - p) + cfg.endPosY * p,
        cfg.startPosZ * (1 - p) + cfg.endPosZ * p,
      );
      instance.rotation.y = cfg.startRotY * (1 - p) + cfg.endRotY * p;
      instance.scale.setScalar(cfg.startZoom * (1 - p) + cfg.endZoom * p);
    });

    const camCfg = data.camSettings;
    data.camera.position.set(
      camCfg.startCamPosX * (1 - p) + camCfg.endCamPosX * p,
      camCfg.startCamPosY * (1 - p) + camCfg.endCamPosY * p,
      data.baseCamDist +
        (camCfg.startCamPosZ * (1 - p) + camCfg.endCamPosZ * p),
    );
    data.camera.rotation.set(
      camCfg.startCamRotX * (1 - p) + camCfg.endCamRotX * p,
      camCfg.startCamRotY * (1 - p) + camCfg.endCamRotY * p,
      camCfg.startCamRotZ * (1 - p) + camCfg.endCamRotZ * p,
    );

    renderer.render(data.scene, data.camera);
  });
}
