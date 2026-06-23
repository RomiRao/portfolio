import { useState } from "react";
import { Box, Typography } from "@mui/material";

import homeIcon from "../../../assets/icons/home-icon.svg";
import cardIcon from "../../../assets/icons/cardnormal-icon.svg";
import categoryIcon from "../../../assets/icons/category-icon.svg";
import settingsIcon from "../../../assets/icons/settings-icon.svg";
import { colors } from "../nanzas/colors";

const NAV_ITEMS = [
  { id: "dashboard", iconUrl: homeIcon, label: "Home" },
  { id: "cards", iconUrl: cardIcon, label: "Cards" },
  { id: "categories", iconUrl: categoryIcon, label: "Categories" },
  { id: "settings", iconUrl: settingsIcon, label: "Settings" },
];

export default function BottomNavBar({ active: activeProp, onChange }) {
  const [internalActive, setInternalActive] = useState("dashboard");
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
        pb: 2,
        borderRadius: "0 0 28px 28px",
      }}
    >
      {NAV_ITEMS.map((item) => {
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
              transition: "all 0.2s",
            }}
          >
            <img
              src={item.iconUrl}
              alt={item.label}
              style={{
                width: 24,
                height: 24,

                filter: isActive
                  ? "none"
                  : `brightness(0%) saturate(100%) invert(50%) sepia(15%) hue-rotate(180deg)`,
              }}
            />
            <Typography
              sx={{
                fontSize: 10,
                mt: 0.2,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? colors.primary : colors.gray,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
