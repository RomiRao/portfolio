import React from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../colors.js";
import nanzasLogo from "../../../../assets/nanzas-logo-2.svg";

export default function LoginScreen({ onLogin, onNavigateToSignup }) {
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
          onClick={onNavigateToSignup}
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
