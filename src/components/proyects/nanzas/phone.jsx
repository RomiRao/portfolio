import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import { colors } from "./colors.js";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardScreen from "./screens/DashboardScreen";

export default function PhoneMockup() {
  // Estado centralizado para controlar la navegación ("login", "signup", "dashboard")
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <Box
      sx={{
        width: 320,
        height: 680,
        borderRadius: "44px",
        border: "10px solid #1a1a1a",
        bgcolor: colors.bgGreen,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 0 1px #333, 0 24px 48px rgba(0,0,0,0.25)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ==========================================
          HEADER / STATUS BAR (Fijo para todas las pantallas)
          ========================================== */}
      <Box
        sx={{
          pt: "18px",
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
          9:41
        </Typography>

        {/* Dynamic Island */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 110,
            height: 32,
            bgcolor: "black",
            borderRadius: "16px",
          }}
        />

        {/* Iconos derechos (Señal, Wifi, Batería) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>ıll</Typography>
          <Typography sx={{ fontSize: 12 }}>🛜</Typography>
          <Box
            sx={{
              width: 22,
              height: 11,
              border: "1px solid #111",
              borderRadius: "3px",
              position: "relative",
              ml: 0.5,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 1,
                bgcolor: "#111",
                borderRadius: "1px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: -3,
                top: "2.5px",
                width: 2,
                height: 4,
                bgcolor: "#111",
                borderRadius: "0 1px 1px 0",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ==========================================
          ENRUTADOR DINÁMICO DE PANTALLAS
          ========================================== */}
      {currentScreen === "login" && (
        <LoginScreen
          onLogin={() => setCurrentScreen("dashboard")}
          onNavigateToSignup={() => setCurrentScreen("signup")}
        />
      )}

      {currentScreen === "signup" && (
        <SignupScreen
          onLogin={() => setCurrentScreen("dashboard")}
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen onBack={() => setCurrentScreen("login")} />
      )}

      {/* ==========================================
          FOOTER / HOME INDICATOR (Fijo para todas las pantallas)
          ========================================== */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 5,
          bgcolor: "#1a1a1a",
          borderRadius: "4px",
          zIndex: 10,
        }}
      />
    </Box>
  );
}
