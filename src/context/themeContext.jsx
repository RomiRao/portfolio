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
    "(prefers-color-scheme: dark)"
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
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
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
