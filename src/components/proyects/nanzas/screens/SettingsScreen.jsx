import React, { useState } from "react";
import { Box, Typography, Switch, Divider } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { colors } from "../colors";

export default function SettingsScreen({ onChange }) {
  const [view, setView] = useState("main");
  const [darkMode, setDarkMode] = useState(true);

  const Row = ({ label, value, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Typography sx={{ fontSize: 16, color: colors.black }}>
        {label}
      </Typography>
      {typeof value === "string" ? (
        <Typography sx={{ fontSize: 14, color: colors.primary }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );

  if (view === "account") {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: 3,
          pt: 1,
          pb: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            onClick={() => setView("main")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: colors.primary,
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.primary,
            }}
          >
            Account settings
          </Typography>
        </Box>

        <Row label="Email" value="email@gmail.com" />
        <Row label="Password" value="**************" />

        <Box sx={{ mt: 1 }}>
          <Typography
            onClick={() => {
              /* sin lógica real */
            }}
            sx={{
              fontSize: 16,
              color: colors.error,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Delete account
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        px: 3,
        pt: 1,
        pb: 2,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 700,
          color: colors.primary,
          mb: 2,
        }}
      >
        Settings
      </Typography>

      <Row label="Currency" value="Dolar USD - $" />
      <Row label="Language" value="English" />
      <Row
        label="Dark mode"
        value={
          <Switch
            disabled
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: colors.primary,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: colors.primary,
              },
            }}
          />
        }
      />

      <Divider sx={{ borderColor: colors.gray, my: 1.5 }} />

      <Row label="Account settings" onClick={() => setView("account")} />
      <Row label="Log out" onClick={() => onChange && onChange("login")} />
    </Box>
  );
}
