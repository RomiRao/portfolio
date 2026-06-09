import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import nanzasLogo from "../../../assets/nanzas-logo-2.svg";

const colors = {
  primary: "#376632", // Verde oscuro para texto y botón
  bgGreen: "#DCE7D6", // Verde claro para el fondo superior
  border: "#8BA783", // Verde medio para los bordes de los inputs
};

// ==========================================
// 1. COMPONENTE: PANTALLA DE LOGIN
// ==========================================
function LoginScreen({ onLogin }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "white",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 4,
        pt: 6,
        pb: 4,
        mt: 1,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={nanzasLogo}
          alt="Nanzas Logo"
          sx={{ width: 100, height: 100, objectFit: "contain" }}
        />
        <Typography
          sx={{ fontSize: 28, fontWeight: 500, color: colors.primary }}
        >
          Nanzas
        </Typography>
      </Box>

      {/* Formularios */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 14, color: "#111", mb: 0.8, fontWeight: 500 }}
          >
            Email
          </Typography>
          <Box
            sx={{
              height: 44,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              bgcolor: "white",
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{ fontSize: 14, color: "#111", mb: 0.8, fontWeight: 500 }}
          >
            Password
          </Typography>
          <Box
            sx={{
              height: 44,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              bgcolor: "white",
            }}
          />
        </Box>

        {/* Botón Log in (Con evento para cambiar de pantalla) */}
        <Box
          onClick={onLogin}
          sx={{
            mt: 2,
            height: 48,
            bgcolor: colors.primary,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer", // Añadido para que se vea clickeable
            "&:hover": { opacity: 0.9 },
          }}
        >
          <Typography sx={{ color: "white", fontSize: 16, fontWeight: 600 }}>
            Log in
          </Typography>
        </Box>

        {/* Enlace Sign up */}
        <Typography
          sx={{
            fontSize: 13,
            color: colors.primary,
            textAlign: "center",
            mt: 1,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Don't have an account? Sign up
        </Typography>
      </Box>
    </Box>
  );
}

// ==========================================
// 2. COMPONENTE: PANTALLA EN CONSTRUCCIÓN
// ==========================================
function PlaceholderScreen({ onBack }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "white",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 1,
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#111", mb: 2 }}>
        Pantalla
      </Typography>
      <Typography
        onClick={onBack}
        sx={{
          fontSize: 14,
          color: colors.primary,
          cursor: "pointer",
          fontWeight: 500,
          textDecoration: "underline",
        }}
      >
        Volver al Login
      </Typography>
    </Box>
  );
}

// ==========================================
// 3. COMPONENTE PRINCIPAL: CARCASA DEL TELÉFONO
// ==========================================
export default function PhoneMockup() {
  // Estado para controlar qué pantalla se renderiza
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
      {/* Header / Status bar */}
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

        {/* Iconos derechos */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>ıll</Typography>
          <Typography sx={{ fontSize: 12 }}>🛜</Typography>
          {/* Icono de batería custom */}
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

      {/* RENDERIZADO DINÁMICO DE PANTALLAS */}
      {currentScreen === "login" ? (
        <LoginScreen onLogin={() => setCurrentScreen("dashboard")} />
      ) : (
        <PlaceholderScreen onBack={() => setCurrentScreen("login")} />
      )}

      {/* Home indicator (La barrita de abajo de iOS) */}
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
