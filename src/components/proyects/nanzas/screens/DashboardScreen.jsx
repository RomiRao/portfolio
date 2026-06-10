import React from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../colors";

// Agregamos onBack a los parámetros de la función
export default function Dashboard({ onBack }) {
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
        onClick={onBack} // Ahora onBack funcionará correctamente
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
