import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Home, CreditCard, Add, GridView, Settings } from "@mui/icons-material";
import { colors } from "./colors.js";

const NAV_ITEMS = [
  { id: "home", icon: <Home />, label: "Home" },
  { id: "cards", icon: <CreditCard />, label: "Cards" },
  { id: "add", icon: null, label: "" },
  { id: "categories", icon: <GridView />, label: "Categories" },
  { id: "settings", icon: <Settings />, label: "Settings" },
];

export default function BottomNavBar({ active: activeProp, onChange }) {
  const [internalActive, setInternalActive] = useState("home");

  // Soporta uso controlado (con active+onChange) o no controlado (estado interno)
  const active = activeProp ?? internalActive;
  const handleChange = (id) => {
    if (!activeProp) setInternalActive(id);
    onChange?.(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        bgcolor: colors.surface,
        borderTop: "1px solid #e0e0e0",
        pt: 1,
        pb: "25px",
        borderRadius: "0 0 28px 28px",
      }}
    >
      {NAV_ITEMS.map((item) => {
        if (item.id === "add") {
          return (
            <Box
              key="add"
              onClick={() => handleChange("add")}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(46,125,50,0.4)",
                mt: -2.5,
              }}
            >
              <Add sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          );
        }

        const isActive = active === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => handleChange(item.id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              minWidth: 44,
              color: isActive ? colors.primary : colors.textMuted,
            }}
          >
            <Box sx={{ fontSize: 22 }}>{item.icon}</Box>
            <Typography
              sx={{ fontSize: 10, mt: 0.2, fontWeight: isActive ? 700 : 400 }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
