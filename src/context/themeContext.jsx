import { createContext, useContext, useState } from "react";
import {
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const ThemeContext = createContext();

export function ThemeProviderCustom({ children }) {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return prefersDarkMode;
  });

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#50689C" : "#374b77",
      },
      secondary: {
        main: darkMode ? "#28dacb" : "#0d6768",
      },
      fondoTarjetitas: {
        fondo: darkMode ? "#111827" : "#fcf8f4",
        borde: darkMode ? "#172033" : "#ffffff",
        sombra: darkMode ? "#0000002c" : "#0000000c",
      },
      background: {
        default: darkMode ? "#0d1117" : "#e9e2d8",
        paper: "transparent",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, handleThemeToggle, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useDarkMode = () => useContext(ThemeContext);
