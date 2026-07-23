import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "./context/themeContext.jsx";
import SkillsCarousel from "./components/skillsCarousel/skillsCarousel";

// Iconos
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import BrushIcon from "@mui/icons-material/Brush";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fondo3Dark from "./assets/fondo-3.svg";
import fondo3Light from "./assets/fondo-3-claro.svg";
import fondo4Dark from "./assets/fondo-4.svg";
import fondo4Light from "./assets/fondo-4-claro.svg";

import "./App.css";
import Header from "./components/header/header";
import About from "./components/about me/about";
import Ux from "./components/ux proyects/ux";
import Front from "./components/front proyects/front";
import Contact from "./components/contact/contact";
import StarField from "./components/starField/StarField";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { text: "UX/UI Projects", path: "#ux" },
  { text: "Front Projects", path: "#front" },
  { text: "About Me", path: "#about" },
  { text: "Contact", path: "#contact" },
];

function App() {
  const { darkMode, handleThemeToggle, theme } = useDarkMode();
  const [navOpen, setNavOpen] = useState(false);

  const sections = ["home", "ux", "skills", "front", "about", "contact"];

  const sectionRoutes = {
    home: "/",
    ux: "#ux",
    skills: "#skills",
    front: "#front",
    about: "#about",
    contact: "#contact",
  };

  const introLayerRef = useRef(null);

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

      // 4. Capa de entrada (fondo-4 / reeds): al montar, desliza desde abajo
      // hasta su posición de reposo; recién al terminar esa animación se
      // engancha el mismo parallax de scroll que las demás capas, para que
      // no compitan por la propiedad "y" al mismo tiempo.
      const introLayer = introLayerRef.current;
      if (introLayer) {
        const introSpeed =
          parseFloat(introLayer.getAttribute("data-speed")) || 0.85;

        gsap.set(introLayer, { y: "60vh" });
        gsap.to(introLayer, {
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(introLayer, {
              y: `-${introSpeed * 200}vh`,
              ease: "none",
              scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  if (!theme) return null;

  // Velocidades escalonadas: a mayor velocidad, mayor altura para cubrir el desplazamiento sin dejar huecos.
  // (fondo-1 ya no es una imagen con parallax, así que arranca en la segunda velocidad.)
  const starsSpeed = 0.45;
  const gradientSpeed = 0.65;
  const reedsSpeed = 0.85;

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

          {/* Desktop: inline links */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {NAV_LINKS.map(({ text, path }) => (
              <Button key={text} color="inherit" component="a" href={path}>
                {text}
              </Button>
            ))}
          </Box>

          {/* Mobile: hamburger menu */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setNavOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Box>

      <Drawer anchor="right" open={navOpen} onClose={() => setNavOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }} role="presentation">
          <List>
            {NAV_LINKS.map(({ text, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component="a"
                  href={path}
                  onClick={() => setNavOpen(false)}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 2. CAPAS DEL FONDO (PARALLAX) */}

      {/* Capa 1 (antes fondo-1): color sólido de fondo, sin parallax. */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          bgcolor: darkMode ? "#1F2644" : "#ffffff",
        }}
      />

      {/* Capa 2 (antes fondo-2): campo de estrellas titilando. */}
      <Box
        className="parallax-bg"
        data-speed={starsSpeed}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `${100 + starsSpeed * 100 + 10}vh`,
          zIndex: -1,
        }}
      >
        <StarField darkMode={darkMode} />
      </Box>

      {/* Capa 3 (antes fondo-3): degradado svg. */}
      <Box
        className="parallax-bg"
        data-speed={gradientSpeed}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `${100 + gradientSpeed * 100 + 10}vh`,
          zIndex: -1,
          backgroundImage: `url(${darkMode ? fondo3Dark : fondo3Light})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Capa 4 (antes fondo-4): juncos svg. Arranca fuera de cuadro y
          desliza hacia su posición de reposo al montar (ver useEffect). */}
      <Box
        ref={introLayerRef}
        data-speed={reedsSpeed}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `${100 + reedsSpeed * 100 + 10}vh`,
          zIndex: -1,
          backgroundImage: `url(${darkMode ? fondo4Dark : fondo4Light})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

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
          justifyContent: "space-between",
          gap: 30,
          pt: 30,
        }}
      >
        {/* SKILLS - (Sin título scrolleable según tu último código) */}
        <Box id="skills" sx={{ scrollMarginTop: "64px" }}>
          <SkillsCarousel speed={40} />
        </Box>

        {/* UX PROJECTS */}
        <Box id="ux" sx={{ scrollMarginTop: "64px" }}>
          <Container maxWidth="lg">
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
          <Contact />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
