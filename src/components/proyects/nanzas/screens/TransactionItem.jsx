import {
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
} from "@mui/material";
import {
  CalendarToday,
  BarChart,
  ChevronRight,
  ChevronLeft,
  MoreVert,
} from "@mui/icons-material";

const isColorDark = (hex) => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.7;
};

export default function TransactionItem({
  icon,
  iconBg,
  title,
  sub,
  amount,
  onMenuClick,
}) {
  const isDark = isColorDark(iconBg);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8 }}>
      <Avatar
        sx={{
          bgcolor: iconBg,
          width: 38,
          height: 38,
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            filter: isDark ? "brightness(0) invert(1)" : "none",
            transition: "filter 0.2s ease",
          }}
        >
          {icon}
        </Box>
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#999" }}>{sub}</Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: amount.includes("-") ? "#c62828" : "#2e7d32",
        }}
      >
        {amount}
      </Typography>

      <IconButton size="small" sx={{ p: 0.3 }} onClick={onMenuClick}>
        <MoreVert sx={{ fontSize: 17, color: "#bbb" }} />
      </IconButton>
    </Box>
  );
}
