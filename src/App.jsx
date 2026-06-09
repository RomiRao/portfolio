import { useState, useEffect } from "react";
import { useDarkMode } from "./context/themeContext.jsx";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import "./App.css";
import Header from "./components/header/header";
import About from "./components/about me/about";
import Skills from "./components/skills/skills";
import Ux from "./components/ux proyects/ux";
import Front from "./components/front proyects/front";
import Contact from "./components/contact/contact";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";

function App() {
  const { darkMode, handleThemeToggle, theme } = useDarkMode();

  const sections = ["", "ux", "about", "skills", "front", "contact"];

  const sectionRoutes = {
    "": "/",
    ux: "#ux",
    about: "#about",
    skills: "#skills",
    front: "#front",
    contact: "#contact",
  };

  useEffect(() => {
    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            history.replaceState(null, "", sectionRoutes[id]); // "/" para header, "#ux" para el resto
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push({ observer, el });
    });

    return () => {
      observers.forEach(({ observer, el }) => observer.unobserve(el));
    };
  }, []);

  if (!theme) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
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
        <Toolbar
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: "transparent !important",
          }}
        >
          <IconButton color="inherit" onClick={handleThemeToggle} edge="start">
            {darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          {[
            { text: "About Me", path: "#about" },
            // { text: "Skills", path: "#skills" },
            { text: "Bests Proyects", path: "#ux" },
            { text: "Front Proyects", path: "#front" },
            { text: "Contact", path: "#contact" },
          ].map(({ text, path }) => (
            <Button key={text} color="inherit" component="a" href={path}>
              {text}
            </Button>
          ))}
        </Toolbar>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Header id="header" />
        <Ux id="ux" />
        <About id="about" />
        {/* <Skills id="skills" /> */}
        <Front id="front" sx={{ scrollMarginTop: "64px" }} />
        <Contact id="contact" />
      </Box>
    </Box>
  );
}

export default App;
