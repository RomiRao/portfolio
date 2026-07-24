import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// How many cards behind the active one stay visible, fanned out.
const STACK_DEPTH = 3;

const projects = [
  {
    title: "Movies Browser",
    description:
      "On this project I applied all the knowledge from ADA ITW FrontEnd Developer Career.",
    img: "/assets-front/movie.png",
    repository: "https://github.com/RomiRao/movies/tree/main",
    deploy: "https://movies-browser-omega.vercel.app/",
    tags: ["ReactJS", "MaterialUI", "JavaScript", "tmdb", "Vercel", "GIT"],
  },
  {
    title: "AhorrADAs",
    description:
      "A virtual wallet to register money movements using localstorage.",
    img: "/assets-front/ahorradas.png",
    repository: "https://github.com/RomiRao/ahorrADAs-marce-romi",
    deploy: "https://romirao.github.io/ahorrADAs-marce-romi/",
    tags: ["HTML", "CSS", "JavaScript", "GIT"],
  },
  {
    title: "Royal Caribbean Jobs",
    description: "For this project I learned how to use an API with MockAPI",
    img: "/assets-front/RoyalCar.png",
    repository: "https://github.com/RomiRao/jobs",
    deploy: "https://romirao.github.io/jobs/",
    tags: ["HTML", "CSS", "Bootstrap", "APIREST", "JavaScript", "GIT"],
  },
  {
    title: "Readme - Ecommerce",
    description: "Just a small project to show skills between ecommerce.",
    img: "/assets-front/readMe.png",
    repository: "https://github.com/RomiRao/READ-ME",
    deploy: "https://read-me-five.vercel.app/",
    tags: [
      "ReactJS",
      "MaterialUI",
      "JavaScript",
      "tmdb",
      "Vercel",
      "GIT",
      "Firebase",
    ],
  },
  {
    title: "ToDo App",
    description: "Just a simple ToDo app, done with react and Materiaul UI.",
    img: "/assets-front/toDo.png",
    repository: "https://github.com/RomiRao/AdaTasks",
    deploy: "https://ada-tasks.vercel.app/",
    tags: [
      "ReactJS",
      "localStorage",
      "JavaScript",
      "MaterialUI",
      "Vercel",
      "GIT",
    ],
  },
  {
    title: "Meme Generator",
    description: "A fun project using JavaScript for the first time!",
    img: "/assets-front/meme.png",
    repository: "https://github.com/RomiRao/meme-generator",
    deploy: "https://romirao.github.io/meme-generator/",
    tags: ["HTML", "CSS", "JavaScript", "GIT"],
  },
  {
    title: "Choppify",
    description:
      "Just a very small project playing with javascript. To create your own Chopper.",
    img: "/assets-front/choppify.png",
    repository: "https://github.com/RomiRao/choppify",
    deploy: "https://romirao.github.io/choppify/",
    tags: ["HTML", "CSS", "JavaScript", "GIT"],
  },
  {
    title: "Restaurant Landing Page",
    description: "A smal landing page done in one day.",
    img: "/assets-front/landing.png",
    repository: "https://github.com/RomiRao/prueba-landing-page",
    deploy: "https://prueba-landing-page.vercel.app/",
    tags: ["ReactJS", "MaterialUI", "JavaScript", "Vercel", "GIT"],
  },
];

// The active card is a wide rectangle on larger screens, but square on
// mobile; cards behind it are smaller squares, fanned out in their own row
// below it.
const ASPECT = 2.3;
const ASPECT_MOBILE = 1;
const STACK_FRACTION = 0.26; // stack card side, as a fraction of the front card's width
const STACK_FRACTION_MOBILE = 0.36; // a bit bigger on small screens, easier to tap
const STACK_GAP = 56; // px between the front card's bottom and the stack row
const FAN_X_MULT = [-1, 0, 1];
const FAN_ROTATE = [-8, 0, 8];
const FAN_Y_JITTER = [10, 0, 10];

// Where/how big a card is, keyed by its distance behind the active card
// (0 = front). `stageWidth` is the measured pixel width of the front card.
function geometry(depth, stageWidth, aspect, stackFraction) {
  const frontHeight = stageWidth / aspect;
  const stackSize = stageWidth * stackFraction;

  if (depth === 0) {
    return {
      width: stageWidth,
      height: frontHeight,
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      zIndex: projects.length,
    };
  }
  if (depth > STACK_DEPTH) {
    return {
      width: stackSize,
      height: stackSize,
      x: (stageWidth - stackSize) / 2,
      y: frontHeight + STACK_GAP,
      rotate: 0,
      opacity: 0,
      zIndex: 0,
    };
  }
  const slot = depth - 1;
  return {
    width: stackSize,
    height: stackSize,
    x: (stageWidth - stackSize) / 2 + FAN_X_MULT[slot] * stackSize * 0.4,
    y: frontHeight + STACK_GAP + FAN_Y_JITTER[slot],
    rotate: FAN_ROTATE[slot],
    opacity: 1,
    zIndex: projects.length - depth,
  };
}

function Front({ id }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const aspect = isMobile ? ASPECT_MOBILE : ASPECT;
  const stackFraction = isMobile ? STACK_FRACTION_MOBILE : STACK_FRACTION;
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];
  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const isFirstActiveRender = useRef(true);

  const depthOf = (index) =>
    (index - activeIndex + projects.length) % projects.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const update = () => setStageWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:599.95px)");
    setIsMobile(mq.matches);
    const update = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Snaps every card to its correct geometry — used on mount and whenever the
  // stage is resized. Kills any in-flight tween first so a resize can't fight
  // with the nav-triggered animation below.
  useEffect(() => {
    if (!stageWidth) return;
    cardRefs.current.forEach((el, i) => {
      const depth = depthOf(i);
      const target = geometry(depth, stageWidth, aspect, stackFraction);
      gsap.killTweensOf(el);
      gsap.set(el, target);
      const footer = el.querySelector(".card-footer");
      if (footer) {
        gsap.killTweensOf(footer);
        gsap.set(footer, {
          opacity: depth === 0 ? 1 : 0,
          pointerEvents: depth === 0 ? "auto" : "none",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageWidth, aspect, stackFraction]);

  useEffect(() => {
    if (isFirstActiveRender.current) {
      isFirstActiveRender.current = false;
      return;
    }
    if (!stageWidth) return;
    cardRefs.current.forEach((el, i) => {
      const depth = depthOf(i);
      const target = geometry(depth, stageWidth, aspect, stackFraction);
      gsap.to(el, {
        ...target,
        duration: 0.6,
        ease: "power3.out",
      });
      const footer = el.querySelector(".card-footer");
      if (footer) {
        gsap.to(footer, {
          opacity: depth === 0 ? 1 : 0,
          duration: 0.35,
          ease: "power2.out",
          onStart() {
            if (depth === 0) footer.style.pointerEvents = "auto";
          },
          onComplete() {
            if (depth !== 0) footer.style.pointerEvents = "none";
          },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleNext = () => setActiveIndex((i) => (i + 1) % projects.length);
  const handlePrev = () =>
    setActiveIndex((i) => (i - 1 + projects.length) % projects.length);

  // Swipe/drag support: swiping the stage left/right moves to the next/prev
  // card, same as the arrow buttons. A small threshold keeps ordinary clicks
  // on a stacked card (near-zero movement) from also triggering a swipe.
  const dragState = useRef({ startX: 0, dragging: false, swiped: false });
  const SWIPE_THRESHOLD = 40;

  const handlePointerDown = (e) => {
    dragState.current = { startX: e.clientX, dragging: true, swiped: false };
  };
  const handlePointerUp = (e) => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    dragState.current.swiped = true;
    if (delta < 0) handleNext();
    else handlePrev();
  };

  const navButtonSx = {
    width: { xs: 44, sm: 56, md: 64 },
    height: { xs: 44, sm: 56, md: 64 },
    flexShrink: 0,
    color: "primary.main",
    "&:hover": { bgcolor: "transparent", color: "primary.dark" },
  };
  const navIconSx = {
    fontSize: { xs: 32, sm: 40, md: 48 },
  };

  return (
    <section id={id}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1300px",
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1, sm: 2, md: 4 },
          px: { xs: 1, sm: 2 },
          // The stacked cards below the active one are position:absolute, so
          // they don't add to this box's own height — reserve real layout
          // space for them here, or they'd visually overlap the next section.
          pb: `${STACK_GAP + stageWidth * stackFraction + 24}px`,
        }}
      >
        <IconButton onClick={handlePrev} sx={navButtonSx}>
          <ChevronLeftIcon sx={navIconSx} />
        </IconButton>

        <Box
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          sx={{
            position: "relative",
            width: "100%",
            flex: 1,
            minWidth: 0,
            aspectRatio: { xs: `${ASPECT_MOBILE}`, sm: `${ASPECT}` },
            touchAction: "pan-y",
          }}
        >
          {projects.map((project, i) => {
            const depth = depthOf(i);
            const isStacked = depth > 0 && depth <= STACK_DEPTH;
            return (
            <Box
              key={project.title}
              ref={addCardRef}
              onClick={
                isStacked
                  ? () => {
                      if (dragState.current.swiped) {
                        dragState.current.swiped = false;
                        return;
                      }
                      setActiveIndex(i);
                    }
                  : undefined
              }
              role={isStacked ? "button" : undefined}
              tabIndex={isStacked ? 0 : undefined}
              aria-label={isStacked ? `Show ${project.title}` : undefined}
              onKeyDown={
                isStacked
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveIndex(i);
                      }
                    }
                  : undefined
              }
              sx={(theme) => ({
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "20px",
                overflow: "hidden",
                border: `1px solid ${theme.palette.fondoTarjetitas.borde}`,
                boxShadow: 6,
                cursor: isStacked ? "pointer" : "default",
              })}
            >
              <Box
                component="img"
                src={project.img}
                alt={project.title}
                draggable={false}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
                className="card-footer"
                sx={(theme) => ({
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  px: 2,
                  pt: 5,
                  pb: 1.25,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0) 100%)"
                      : "linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0) 100%)",
                })}
              >
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    fontWeight: 500,
                  })}
                >
                  {project.title}
                </Typography>
                <IconButton
                  component="a"
                  href={project.deploy}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={(theme) => ({
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    transition: "transform 0.2s ease, color 0.2s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      transform: "translateX(4px)",
                    },
                  })}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            );
          })}
        </Box>

        <IconButton onClick={handleNext} sx={navButtonSx}>
          <ChevronRightIcon sx={navIconSx} />
        </IconButton>
      </Box>
    </section>
  );
}

export default Front;
