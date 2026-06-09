import { useState } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

function PhoneMockup({ activeScreen }) {
  return (
    <Box
      sx={{
        width: 260,
        height: 520,
        borderRadius: "38px",
        border: "8px solid #1a1a1a",
        bgcolor: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 0 1px #333, 0 24px 48px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    >
      {/* Notch */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 26,
          bgcolor: "#1a1a1a",
          borderRadius: "0 0 18px 18px",
          zIndex: 10,
        }}
      />

      {/* Status bar */}
      <Box
        sx={{
          pt: "30px",
          px: 2,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
          bgcolor: green.soft,
        }}
      >
        <Typography sx={{ fontSize: 10, color: "#333" }}>9:41</Typography>
        <Typography sx={{ fontSize: 10, color: "#333" }}>▲ ◀ ■</Typography>
      </Box>

      {/* Screen content */}
      <Box
        sx={{
          height: "100%",
          bgcolor: green.soft,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          gap: 2,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <svg width="56" height="64" viewBox="0 0 56 64">
            <ellipse
              cx="28"
              cy="34"
              rx="22"
              ry="26"
              fill={green.primary}
              opacity="0.85"
            />
            <ellipse
              cx="28"
              cy="34"
              rx="13"
              ry="18"
              fill={green.mid}
              opacity="0.7"
            />
            <ellipse
              cx="28"
              cy="34"
              rx="6"
              ry="10"
              fill="#c8e6a0"
              opacity="0.8"
            />
            <ellipse cx="28" cy="16" rx="10" ry="8" fill={green.primary} />
          </svg>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
              color: green.dark,
            }}
          >
            Nanzas
          </Typography>
        </Box>

        {activeScreen === "login" && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {["Email", "Password"].map((label) => (
              <Box key={label}>
                <Typography sx={{ fontSize: 11, color: "#444", mb: 0.5 }}>
                  {label}
                </Typography>
                <Box
                  sx={{
                    height: 34,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    bgcolor: "white",
                  }}
                />
              </Box>
            ))}
            <Box
              sx={{
                mt: 1,
                height: 38,
                bgcolor: green.primary,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ color: "white", fontSize: 13, fontWeight: 600 }}
              >
                Log in
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 10,
                color: green.primary,
                textAlign: "center",
                mt: 0.5,
              }}
            >
              Don't have an account? Sign up
            </Typography>
          </Box>
        )}

        {activeScreen === "dashboard" && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                bgcolor: green.primary,
                borderRadius: "12px",
                p: 1.5,
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>
                Total balance
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                $4,280.00
              </Typography>
            </Box>
            {[
              { label: "Expenses", value: "-$1,240", color: "#e24b4a" },
              { label: "Income", value: "+$5,520", color: green.primary },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "white",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography sx={{ fontSize: 11, color: "#555" }}>
                  {item.label}
                </Typography>
                <Typography
                  sx={{ fontSize: 11, fontWeight: 600, color: item.color }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {activeScreen === "expenses" && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {[
              { name: "Groceries", amount: "-$120", cat: "Food" },
              { name: "Netflix", amount: "-$15", cat: "Entertainment" },
              { name: "Transport", amount: "-$40", cat: "Transport" },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "white",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 600, color: "#333" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: "#999" }}>
                    {item.cat}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontSize: 11, fontWeight: 600, color: "#e24b4a" }}
                >
                  {item.amount}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {activeScreen === "income" && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {[
              { name: "Salary", amount: "+$3,500" },
              { name: "Freelance", amount: "+$1,200" },
              { name: "Dividends", amount: "+$820" },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "white",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography
                  sx={{ fontSize: 11, fontWeight: 600, color: "#333" }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{ fontSize: 11, fontWeight: 600, color: green.primary }}
                >
                  {item.amount}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Home indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 4,
          bgcolor: "#1a1a1a",
          borderRadius: "4px",
        }}
      />
    </Box>
  );
}

export default function NanzasProject() {
  const [activeScreen, setActiveScreen] = useState("login");

  const currentNote = screens.find((s) => s.id === activeScreen)?.note;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: green.soft,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, md: 6 },
        py: 8,
        gap: 6,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", maxWidth: 600 }}>
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
          Nanzas — Personal Finance App
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#555",
            lineHeight: 1.75,
            maxWidth: 520,
            mx: "auto",
          }}
        >
          My goal with this project was to build a finance app that lets users
          track their expenses and income — designed for both mobile and web. I
          handled the full product cycle: UX research, wireframing, prototyping
          in Figma, and front-end development.
        </Typography>

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
    </Box>
  );
}
