import React, { useEffect, useId, useRef } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";
import {
  registerViewer,
  unregisterViewer,
  DEFAULT_PHONE_MESH_MAP,
  DEFAULT_LAPTOP_MESH_MAP,
  DEFAULT_PHONE_INSTANCE_SETTINGS,
  DEFAULT_CAM_SETTINGS,
} from "../../three/phoneStackManager";

export {
  DEFAULT_PHONE_MESH_MAP,
  DEFAULT_LAPTOP_MESH_MAP,
  DEFAULT_PHONE_INSTANCE_SETTINGS,
  DEFAULT_CAM_SETTINGS,
} from "../../three/phoneStackManager";

// Convenience named exports: the two phone framings from the POC, ready to
// pass straight into `settings` when you call <PhoneMockup3D type="phone" />
// twice to recreate the two-phone mockup.
export const DEFAULT_PHONE_PRIMARY_SETTINGS =
  DEFAULT_PHONE_INSTANCE_SETTINGS[0];
export const DEFAULT_PHONE_SECONDARY_SETTINGS =
  DEFAULT_PHONE_INSTANCE_SETTINGS[1];

import iphoneModel from "../../assets/3d-model/phone/iphone.gltf?url";
// Uncomment once the laptop .gltf is in place, then uncomment the "laptop"
// entry in MODEL_CONFIG below — that's the only wiring needed.
// import laptopModel from "../../assets/3d-model/laptop/laptop.gltf?url";

// ────────────────────────────────────────────────────────────────────────────
// Central model registry: add one entry per `type` you want PhoneMockup3D to
// support. Each entry bundles the .gltf URL with the mesh map that tells the
// manager which nodes are the screen / tinted body / etc. for that specific
// model file (phone and laptop models won't share node names).
// ────────────────────────────────────────────────────────────────────────────
const MODEL_CONFIG = {
  phone: {
    modelUrl: iphoneModel,
    meshMap: DEFAULT_PHONE_MESH_MAP,
  },
  // laptop: {
  //   modelUrl: laptopModel,
  //   meshMap: DEFAULT_LAPTOP_MESH_MAP,
  // },
};

/**
 * Renders ONE 3D model instance (a single phone or laptop) inside its own
 * viewport, with its own independent scene/camera managed by
 * phoneStackManager. It renders nothing visual on its own besides the 3D
 * model — no background image — so you compose it with plain CSS/MUI Boxes.
 *
 * To recreate the two-phone mockup, render this component TWICE inside a
 * relatively-positioned container, each with `position: absolute, inset: 0`
 * and its own `settings` (one primary, one secondary):
 *
 *   <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
 *     <img src={backgroundImage} ... />
 *     <Box sx={{ position: "absolute", inset: 0 }}>
 *       <PhoneMockup3D type="phone" screen={screen1} settings={DEFAULT_PHONE_PRIMARY_SETTINGS} isHovered={isHovered} />
 *     </Box>
 *     <Box sx={{ position: "absolute", inset: 0 }}>
 *       <PhoneMockup3D type="phone" screen={screen2} settings={DEFAULT_PHONE_SECONDARY_SETTINGS} isHovered={isHovered} isSecondary />
 *     </Box>
 *   </Box>
 *
 * Props:
 * - type: "phone" | "laptop" — picks the model + mesh map from MODEL_CONFIG
 * - screen: single screen image for this instance (optional — falls back to
 *   a generated placeholder using bg/title/sub)
 * - isSecondary: only affects the generated placeholder's style when no
 *   `screen` image is passed
 * - settings: {start/end Pos/Rot/Zoom} for THIS instance
 * - camSettings: the 6DOF camera start/end rig (shared is fine if two
 *   instances share the same framing)
 * - isHovered: drives the progress 0 → 1 animation
 */
function PhoneMockup3D({
  type = "phone",
  groupId,
  screen,
  bg,
  tint,
  title,
  sub,
  isSecondary = false,
  settings = DEFAULT_PHONE_PRIMARY_SETTINGS,
  camSettings = DEFAULT_CAM_SETTINGS,
  isHovered = false,
  sx,
}) {
  const reactId = useId();
  const viewerRef = useRef(null);
  const animState = useRef({ progress: 0 }).current;
  const tweenRef = useRef(null);

  const modelConfig = MODEL_CONFIG[type];

  useEffect(() => {
    const element = viewerRef.current;
    if (!element || !modelConfig) return undefined;

    registerViewer({
      id: `phone-mockup-${reactId}`,
      // Instances that don't share a groupId are treated as their own
      // isolated group (each gets a full clear), which is the right default
      // when a single PhoneMockup3D is used on its own. Pass a shared
      // groupId (e.g. the card/project id) when rendering several instances
      // that overlap the same viewport, like a primary+secondary phone pair.
      groupId: groupId ?? `phone-mockup-${reactId}`,
      element,
      modelUrl: modelConfig.modelUrl,
      meshMap: modelConfig.meshMap,
      screens: [screen],
      bg,
      tint,
      title,
      sub,
      isSecondary,
      instanceSettings: [settings],
      camSettings,
      animState,
    });

    return () => unregisterViewer(`phone-mockup-${reactId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, modelConfig, reactId, groupId]);

  useEffect(() => {
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.to(animState, {
      progress: isHovered ? 1 : 0,
      duration: 0.8,
      ease: "power2.out",
    });
    return () => tweenRef.current?.kill();
  }, [isHovered, animState]);

  if (!modelConfig) {
    if (import.meta.env?.DEV) {
      console.warn(
        `PhoneMockup3D: no model configured for type "${type}" yet — add it to MODEL_CONFIG.`,
      );
    }
    return null;
  }

  return (
    <Box
      ref={viewerRef}
      sx={{
        width: "100%",
        height: "100%",
        ...sx,
      }}
    />
  );
}

export default PhoneMockup3D;
