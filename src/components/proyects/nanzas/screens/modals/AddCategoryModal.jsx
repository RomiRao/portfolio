import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../../colors";

const iconModules = import.meta.glob("../../../../../assets/icons/*.svg", {
  eager: true,
  as: "url",
});
export const ICONS = Object.entries(iconModules).map(([path, url]) => ({
  name: path.split("/").pop().replace(".svg", ""),
  url,
}));

export const CATEGORY_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#eab308",
  "#84cc16",
  "#10b981",
  "#94a3b8",
];

export const STORAGE_KEY = "nanzas_categories";

export default function NewCategoryModal({ onClose, onSave, initialData }) {
  const [tab, setTab] = useState(initialData?.type || "expense");
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || ICONS[0]?.url || "");
  const [iconName, setIconName] = useState(
    initialData?.iconName || ICONS[0]?.name || ""
  );
  const [color, setColor] = useState(initialData?.color || CATEGORY_COLORS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (initialData) {
      // EDITAR — reemplazar el registro existente
      const updated = existing.map((c) =>
        c.id === initialData.id
          ? { ...c, type: tab, name: name.trim(), icon, iconName, color }
          : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      // CREAR — agregar nuevo
      const cat = {
        id: Date.now(),
        type: tab,
        name: name.trim(),
        icon,
        iconName,
        color,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, cat]));
    }

    onSave();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        bgcolor: "rgba(0,0,0,0.35)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "#fff",
          borderRadius: "20px 20px 0 0",
          p: 2.5,
          pb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            textAlign: "center",
            color: "#111",
            mb: 1.8,
          }}
        >
          {initialData ? "Edit category" : "New category"}
        </Typography>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            bgcolor: "#c8d9b0",
            borderRadius: "10px",
            p: "4px",
            gap: "4px",
            mb: 2,
          }}
        >
          {["expense", "income"].map((t) => (
            <Box
              key={t}
              onClick={() => setTab(t)}
              sx={{
                flex: 1,
                textAlign: "center",
                py: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                bgcolor: tab === t ? colors.primary : "transparent",
                color: tab === t ? "#fff" : "#3a5a1c",
              }}
            >
              {t === "expense" ? "↓ Expense" : "↑ Income"}
            </Box>
          ))}
        </Box>

        {/* Name */}
        <Typography sx={{ fontSize: 12, color: "#555", mb: 0.6 }}>
          Name
        </Typography>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d0d0d0",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            marginBottom: 16,
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        {/* Icon picker */}
        <Typography sx={{ fontSize: 12, color: "#555", mb: 0.8 }}>
          Icon
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
          {ICONS.map((ic) => (
            <Box
              key={ic.name}
              onClick={() => {
                setIcon(ic.url);
                setIconName(ic.name);
              }}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  icon === ic.url
                    ? `2px solid ${colors.primary}`
                    : "2px solid transparent",
                bgcolor: icon === ic.url ? "#e8f5e9" : "transparent",
              }}
            >
              <img
                src={ic.url}
                width="22"
                height="22"
                style={{ filter: "brightness(0)" }}
                alt={ic.name}
              />
            </Box>
          ))}
        </Box>

        {/* Color picker */}
        <Typography sx={{ fontSize: 12, color: "#555", mb: 0.8 }}>
          Color
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          {CATEGORY_COLORS.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: c,
                cursor: "pointer",
                border:
                  color === c ? "3px solid #111" : "3px solid transparent",
              }}
            />
          ))}
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <Box
            onClick={onClose}
            sx={{
              py: "12px",
              textAlign: "center",
              borderRadius: "12px",
              cursor: "pointer",
              bgcolor: "#e8e8e8",
              border: "1px solid #ccc",
              fontSize: 14,
              fontWeight: 500,
              color: "#555",
            }}
          >
            Cancel
          </Box>
          <Box
            onClick={handleSave}
            sx={{
              py: "12px",
              textAlign: "center",
              borderRadius: "12px",
              cursor: "pointer",
              bgcolor: colors.primary,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            Save
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
