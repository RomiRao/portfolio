import React, { useState } from "react";
import { Box, Typography, InputBase, Button } from "@mui/material";
import { colors } from "../../nanzas/colors";

export default function NewCardScreen({ onBack }) {
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cutOffDate, setCutOffDate] = useState("06/08/2026");
  const [expireDate, setExpireDate] = useState("06/08/2026");

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#ffffff",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        px: 3,
        pt: 3,
        pb: 2,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* ==========================================
          HEADER (Flecha Atrás + Título)
          ========================================== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mb: 4,
          mt: 1,
        }}
      >
        <Box
          onClick={onBack}
          sx={{
            position: "absolute",
            left: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            p: 0.5,
          }}
        >
          {/* Icono de flecha izquierda estilizado */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.primary}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Box>

        <Typography
          sx={{
            color: colors.primary,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          New Card
        </Typography>
      </Box>

      {/* ==========================================
          FORMULARIO DE ENTRADA
          ========================================== */}

      {/* Input: Bank / virtual wallet */}
      <Typography
        sx={{
          color: colors.primary,
          fontSize: 13,
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        Bank/ virtual wallet
      </Typography>
      <Box
        sx={{
          border: `1px solid ${colors.primary}`,
          borderRadius: "8px",
          px: 1.5,
          py: 0.8,
          mb: 2.5,
        }}
      >
        <InputBase
          placeholder="Ej: Clothes"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          fullWidth
          sx={{
            fontSize: 14,
            color: colors.textInput,
            "& .MuiInputBase-input::placeholder": {
              color: colors.placeholder,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Input: Card number */}
      <Typography
        sx={{
          color: colors.primaryGreen,
          fontSize: 13,
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        Card number
      </Typography>
      <Box
        sx={{
          border: `1px solid ${colors.borderGreen}`,
          borderRadius: "8px",
          px: 1.5,
          py: 0.8,
          mb: 2.5,
        }}
      >
        <InputBase
          placeholder="Ej: 2034 3839 2637 1049"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          fullWidth
          sx={{
            fontSize: 14,
            color: colors.textInput,
            "& .MuiInputBase-input::placeholder": {
              color: colors.placeholder,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Fila doble: Fechas */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        {/* Input: Monthly cut-off date */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: colors.primaryGreen,
              fontSize: 13,
              fontWeight: 600,
              mb: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            Monthly cut-off date
          </Typography>
          <Box
            sx={{
              border: `1px solid ${colors.borderGreen}`,
              borderRadius: "8px",
              px: 1.2,
              py: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputBase
              value={cutOffDate}
              onChange={(e) => setCutOffDate(e.target.value)}
              sx={{ fontSize: 13, color: colors.textInput }}
            />
            {/* Icono de Calendario */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.primaryGreen}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </Box>
        </Box>

        {/* Input: Expire date */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: colors.primaryGreen,
              fontSize: 13,
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Expire date
          </Typography>
          <Box
            sx={{
              border: `1px solid ${colors.borderGreen}`,
              borderRadius: "8px",
              px: 1.2,
              py: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InputBase
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              sx={{ fontSize: 13, color: colors.textInput }}
            />
            {/* Icono de Calendario */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.primaryGreen}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </Box>
        </Box>
      </Box>

      {/* ==========================================
          BOTONES DE ACCIÓN (Cancel / Save)
          ========================================== */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <Button
          onClick={onBack}
          fullWidth
          disableRipple
          sx={{
            bgcolor: colors.bgCancel,
            color: colors.primaryGreen,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 14,
            py: 1.2,
            "&:hover": { bgcolor: colors.bgCancel },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          disableRipple
          sx={{
            bgcolor: colors.primary,
            color: "#ffffff",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 14,
            py: 1.2,
            "&:hover": { bgcolor: colors.primaryGreen },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
