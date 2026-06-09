import { useState } from "react";
import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useDarkMode } from "../../../context/themeContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PhoneMockup from "./phone";

const green = {
  primary: "#3A6B35",
  light: "#EAF3DE",
  mid: "#639922",
  dark: "#27500A",
  soft: "#f4f8f0",
};

const screens = [
  {
    id: "login",
    label: "Login",
    note: "Clean login screen with email and password. Minimal and focused — no distractions.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    note: "Overview of balance, recent transactions, and spending summary at a glance.",
  },
  {
    id: "expenses",
    label: "Expenses",
    note: "Categorized expenses with filters by date and type. Easy to track where money goes.",
  },
  {
    id: "income",
    label: "Income",
    note: "Log and review all income sources. Compare month by month.",
  },
];

export default function NanzasProject() {
  const { darkMode, handleThemeToggle, theme } = useDarkMode();
  const [activeScreen, setActiveScreen] = useState("login");

  const currentNote = screens.find((s) => s.id === activeScreen)?.note;

  if (!theme) return null;
  return (
    <Box
      sx={{
        minHeight: "100dvh",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, md: 6 },
        py: 4,
        gap: 6,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton color="inherit" onClick={handleThemeToggle} edge="start">
          {darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
        </IconButton>
        <Chip
          label="Case Study · 2026"
          size="small"
          sx={{
            bgcolor: green.light,
            color: green.dark,
            fontWeight: 500,
            fontSize: 11,
            mb: 2,
            letterSpacing: "0.05em",
          }}
        />
      </Box>
      <Box sx={{ textAlign: "center", width: "80%" }}>
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: 28, md: 38 },
            fontWeight: 600,
            color: green.dark,
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          Nanzas Finance App
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#555",
            lineHeight: 1.75,

            mx: "auto",
          }}
        >
          My goal with this project was to build a finance app that lets users
          track their expenses and income, designed for both mobile and web. I
          handled the full product cycle: UX research, wireframing, prototyping
          in Figma, and front-end development. This page is only a prototype for
          ux information but you can download the apk to try it or go to the web
          version.
        </Typography>
      </Box>

      {/* Prototype section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 4, md: 8 },
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 900,
          justifyContent: "center",
        }}
      >
        {/* Left note */}
        <Box
          sx={{
            maxWidth: 200,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              border: `1px solid ${green.light}`,
              borderRadius: "12px",
              p: 2,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                right: -10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: `10px solid white`,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 12.5,
                color: "#555",
                lineHeight: 1.65,
                textAlign: "right",
              }}
            >
              {currentNote}
            </Typography>
          </Box>
        </Box>

        {/* Phone */}
        <PhoneMockup activeScreen={activeScreen} />

        {/* Right nav */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {screens.map((screen) => (
            <Box
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "10px",
                cursor: "pointer",
                bgcolor: activeScreen === screen.id ? green.primary : "white",
                border: `1px solid ${
                  activeScreen === screen.id ? green.primary : green.light
                }`,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    activeScreen === screen.id ? green.primary : green.light,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: activeScreen === screen.id ? "white" : green.dark,
                }}
              >
                {screen.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Mobile note */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor: "white",
          border: `1px solid ${green.light}`,
          borderRadius: "12px",
          p: 2,
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>
          {currentNote}
        </Typography>
      </Box>

      {/* Tools */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["Figma", "React", "Material UI", "UX Research", "Prototyping"].map(
          (tool) => (
            <Chip
              key={tool}
              label={tool}
              size="small"
              variant="outlined"
              sx={{
                borderColor: green.primary,
                color: green.dark,
                fontSize: 11,
              }}
            />
          )
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          href="#"
          sx={{
            bgcolor: green.primary,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { bgcolor: green.dark },
          }}
        >
          Download APK
        </Button>
        <Button
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          href="#"
          target="_blank"
          sx={{
            borderColor: green.primary,
            color: green.primary,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { bgcolor: green.light },
          }}
        >
          Visit Nanzas Web
        </Button>
      </Box>
    </Box>
  );
}
