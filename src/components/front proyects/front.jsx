import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

function Front({ id }) {
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  const projects = [
    {
      title: "Movies Browser",
      description:
        "On this project I applied all the knowledge from ADA ITW FrontEnd Developer Career.",
      img: "../../../public/assets-front/movie.png",
      repository: "https://github.com/RomiRao/movies/tree/main",
      deploy: "https://movies-browser-omega.vercel.app/",
      tags: ["ReactJS", "MaterialUI", "JavaScript", "tmdb", "Vercel", "GIT"],
    },
    {
      title: "AhorrADAs",
      description:
        "A virtual wallet to register money movements using localstorage.",
      img: "../../../public/assets-front/ahorradas.png",
      repository: "https://github.com/RomiRao/ahorrADAs-marce-romi",
      deploy: "https://romirao.github.io/ahorrADAs-marce-romi/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Royal Caribbean Jobs",
      description: "For this project I learned how to use an API with MockAPI",
      img: "../../../public/assets-front/RoyalCar.png",
      repository: "https://github.com/RomiRao/jobs",
      deploy: "https://romirao.github.io/jobs/",
      tags: ["HTML", "CSS", "Bootstrap", "APIREST", "JavaScript", "GIT"],
    },
    {
      title: "Readme - Ecommerce",
      description: "Just a small project to show skills between ecommerce.",
      img: "../../../public/assets-front/readMe.png",
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
      img: "../../../public/assets-front/toDo.png",
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
      img: "../../../public/assets-front/meme.png",
      repository: "https://github.com/RomiRao/meme-generator",
      deploy: "https://romirao.github.io/meme-generator/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Choppify",
      description:
        "Just a very small project playing with javascript. To create your own Chopper.",
      img: "../../../public/assets-front/choppify.png",
      repository: "https://github.com/RomiRao/choppify",
      deploy: "https://romirao.github.io/choppify/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Restaurant Landing Page",
      description: "A smal landing page done in one day.",
      img: "../../../public/assets-front/landing.png",
      repository: "https://github.com/RomiRao/prueba-landing-page",
      deploy: "https://prueba-landing-page.vercel.app/",
      tags: ["ReactJS", "MaterialUI", "JavaScript", "Vercel", "GIT"],
    },
  ];

  useEffect(() => {
    const cards = gsap.utils.toArray(trackRef.current.children);
    const spacing = 0.15; // separación temporal entre cards (stagger)
    const snapTime = gsap.utils.snap(spacing);

    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    // anima cada card: aparece con scale/opacity y se desplaza de derecha a izquierda
    const animateFunc = (element) => {
      const tl = gsap.timeline();
      tl.fromTo(
        element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power1.in",
          immediateRender: false,
        },
      ).fromTo(
        element,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
        0,
      );
      return tl;
    };

    // arma un timeline que loopea infinitamente sin "salto" visible
    function buildSeamlessLoop(items, spacing, animateFunc) {
      const overlap = Math.ceil(1 / spacing);
      const startTime = items.length * spacing + 0.5;
      const loopTime = (items.length + overlap) * spacing + 1;
      const rawSequence = gsap.timeline({ paused: true });
      const seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
          if (this._time === this._dur) this._tTime += this._dur - 0.01;
        },
      });
      const l = items.length + overlap * 2;
      let time, i, index;

      for (i = 0; i < l; i++) {
        index = i % items.length;
        time = i * spacing;
        rawSequence.add(animateFunc(items[index]), time);
      }

      rawSequence.time(startTime);
      seamlessLoop
        .to(rawSequence, {
          time: loopTime,
          duration: loopTime - startTime,
          ease: "none",
        })
        .fromTo(
          rawSequence,
          { time: overlap * spacing + 1 },
          {
            time: startTime,
            duration: startTime - (overlap * spacing + 1),
            immediateRender: false,
            ease: "none",
          },
        );
      return seamlessLoop;
    }

    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
    const playhead = { offset: 0 };
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.offset));
      },
      duration: 0.5,
      ease: "power3",
      paused: true,
    });

    function scrollToOffset(offset) {
      const snappedTime = snapTime(offset);
      scrub.vars.offset = snappedTime;
      scrub.invalidate().restart();
    }

    const handleNext = () => scrollToOffset(scrub.vars.offset + spacing);
    const handlePrev = () => scrollToOffset(scrub.vars.offset - spacing);

    prevBtnRef.current?.addEventListener("click", handlePrev);
    nextBtnRef.current?.addEventListener("click", handleNext);

    // proxy invisible para permitir drag (mouse y touch) sobre las cards
    const dragProxy = document.createElement("div");
    dragProxy.style.visibility = "hidden";
    dragProxy.style.position = "absolute";
    galleryRef.current.appendChild(dragProxy);

    const [draggable] = Draggable.create(dragProxy, {
      type: "x",
      trigger: trackRef.current,
      onPress() {
        this.startOffset = scrub.vars.offset;
      },
      onDrag() {
        scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
        scrub.invalidate().restart();
      },
      onDragEnd() {
        scrollToOffset(scrub.vars.offset);
      },
    });

    scrollToOffset(0);

    return () => {
      prevBtnRef.current?.removeEventListener("click", handlePrev);
      nextBtnRef.current?.removeEventListener("click", handleNext);
      draggable.kill();
      seamlessLoop.kill();
      scrub.kill();
      dragProxy.remove();
    };
  }, []);

  return (
    <section id={id}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ maxWidth: 900, width: "100%" }}>
          <Box
            ref={galleryRef}
            sx={{
              position: "relative",
              width: "100%",
              height: 480,
              overflow: "hidden",
              userSelect: "none",
            }}
          >
            <Box
              ref={trackRef}
              sx={{
                position: "absolute",
                width: 300,
                height: 430,
                top: "42%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {projects.map((project) => (
                <Card
                  key={project.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 300,
                    height: 430,
                    boxShadow: 6,
                  }}
                >
                  <CardMedia
                    sx={{ height: 170 }}
                    image={project.img}
                    title={project.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                    <Stack direction="row" mt={2} flexWrap="wrap">
                      {project.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          color="primary"
                          size="small"
                          variant="filled"
                          sx={{ mr: "4px", my: "4px" }}
                        />
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions>
                    <Button size="small" href={project.deploy} target="_blank">
                      View project
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Button
                ref={prevBtnRef}
                variant="outlined"
                startIcon={<ChevronLeftIcon />}
              >
                Prev
              </Button>
              <Button
                ref={nextBtnRef}
                variant="contained"
                endIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </section>
  );
}

export default Front;
