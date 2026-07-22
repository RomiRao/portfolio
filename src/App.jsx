import { useEffect } from "react";
import { useDarkMode } from "./context/themeContext.jsx";
import SkillsCarousel from "./components/skillsCarousel/skillsCarousel";

// Iconos
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import BrushIcon from "@mui/icons-material/Brush";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portadaOscuro1 from "./assets/fondo-1.png";
import portadaOscuro2 from "./assets/fondo-2.png";
import portadaOscuro3 from "./assets/fondo-3.png";
import portadaOscuro4 from "./assets/fondo-4.png";
import portadaClaro1 from "./assets/fondo-1-claro.png";
import portadaClaro2 from "./assets/fondo-2-claro.png";
import portadaClaro3 from "./assets/fondo-3-claro.png";
import portadaClaro4 from "./assets/fondo-4-claro.png";

import "./App.css";
import Header from "./components/header/header";
import About from "./components/about me/about";
import Ux from "./components/ux proyects/ux";
import Front from "./components/front proyects/front";
import Contact from "./components/contact/contact";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { darkMode, handleThemeToggle, theme } = useDarkMode();

  const sections = ["home", "ux", "skills", "front", "about", "contact"];

  const sectionRoutes = {
    home: "/",
    ux: "#ux",
    skills: "#skills",
    front: "#front",
    about: "#about",
    contact: "#contact",
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Lógica para cambiar la URL en el scroll
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => history.replaceState(null, "", sectionRoutes[id]),
          onEnterBack: () => history.replaceState(null, "", sectionRoutes[id]),
        });
      });

      // 2. Lógica de animación de los títulos
      const titles = gsap.utils.toArray(".scroll-title");

      titles.forEach((title) => {
        gsap.fromTo(
          title,
          {
            opacity: 0,
            x: -150,
          },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: title,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          },
        );
      });

      const backgrounds = gsap.utils.toArray(".parallax-bg");
      backgrounds.forEach((bg) => {
        const speed = parseFloat(bg.getAttribute("data-speed")) || 0.2;

        gsap.to(bg, {
          y: `-${speed * 200}vh`, // Desplaza hacia arriba en vh, proporcional a su velocidad
          ease: "none",
          scrollTrigger: {
            // Ligada solo al alto del header: es la única sección con fondo
            // transparente donde estas capas fijas se ven (el resto de
            // secciones tiene un bgcolor opaco encima). Si el trigger fuera
            // "body" (todo el documento), haría falta scrollear gran parte
            // de la página entera para que una capa como fondo-4 (con su
            // contenido cerca del borde inferior de la imagen) llegue a
            // encuadrarse — para entonces el header ya quedó atrás y su
            // fondo transparente con él.
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true, // Sincroniza la posición directamente con la barra de scroll
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  if (!theme) return null;

  const parallaxLayers = darkMode
    ? [portadaOscuro1, portadaOscuro2, portadaOscuro3, portadaOscuro4]
    : [portadaClaro1, portadaClaro2, portadaClaro3, portadaClaro4];

  // Velocidades escalonadas: a mayor velocidad, mayor altura para cubrir el desplazamiento sin dejar huecos
  const parallaxSpeeds = [0.25, 0.45, 0.65, 0.85];

  return (
    <Box sx={{ minHeight: "100vh", color: theme.palette.text.primary }}>
      {/* 1. NAVBAR */}
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          height: "64px",
        }}
      >
        <Toolbar sx={{ backgroundColor: "transparent !important" }}>
          <IconButton color="inherit" onClick={handleThemeToggle} edge="start">
            {darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          {[
            { text: "UX/UI Projects", path: "#ux" },
            { text: "Front Projects", path: "#front" },
            { text: "About Me", path: "#about" },
            { text: "Contact", path: "#contact" },
          ].map(({ text, path }) => (
            <Button key={text} color="inherit" component="a" href={path}>
              {text}
            </Button>
          ))}
        </Toolbar>
      </Box>

      {/* 2. CAPAS DEL FONDO (PARALLAX) */}
      {parallaxLayers.map((image, index) => {
        const speed = parallaxSpeeds[index];
        return (
          <Box
            key={index}
            className="parallax-bg"
            data-speed={speed}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: `${100 + speed * 100 + 10}vh`,
              zIndex: -1,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        );
      })}

      {/* 3. CONTENIDO DEL HEADER */}
      <Box
        sx={{ position: "relative", zIndex: 1, backgroundColor: "transparent" }}
      >
        <Header id="home" />
      </Box>

      {/* 4. RESTO DE LAS SECCIONES */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          bgcolor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          py: 15,
        }}
      >
        {/* SKILLS - (Sin título scrolleable según tu último código) */}
        <Box id="skills" sx={{ scrollMarginTop: "64px" }}>
          <SkillsCarousel speed={40} />
        </Box>

        {/* UX PROJECTS */}
        <Box id="ux" sx={{ scrollMarginTop: "64px" }}>
          <Container maxWidth="lg">
            <Box
              className="scroll-title"
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
                // Alineación a la izquierda dentro del contenedor centrado
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                UX/UI Projects
              </Typography>
            </Box>
            <Ux />
          </Container>
        </Box>

        {/* FRONT PROJECTS */}
        <Box id="front" sx={{ scrollMarginTop: "64px" }}>
          <Container maxWidth="lg">
            <Box
              className="scroll-title"
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                Front-End Projects
              </Typography>
            </Box>
            <Front />
          </Container>
        </Box>
        {/* ABOUT ME */}
        <Box id="about" sx={{ scrollMarginTop: "64px" }}>
          <Container maxWidth="lg">
            <About />
          </Container>
        </Box>
        {/* CONTACT */}
        <Box id="contact" sx={{ scrollMarginTop: "64px" }}>
          <Container maxWidth="lg">
            <Box
              className="scroll-title"
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                Contact
              </Typography>
            </Box>
            <Contact />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
