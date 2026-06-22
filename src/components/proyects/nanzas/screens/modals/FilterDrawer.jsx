import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const PRIMARY = "#34623f";

const pillSx = {
  borderRadius: "20px",
  border: `1.5px solid ${PRIMARY}55`,
  px: 1.5,
  height: 38,
  display: "flex",
  alignItems: "center",
  fontSize: "0.85rem",
  color: "#2d3732",
};

function FieldLabel({ children }) {
  return (
    <Typography
      sx={{ color: PRIMARY, fontWeight: 700, fontSize: "0.95rem", mb: 0.8 }}
    >
      {children}
    </Typography>
  );
}

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "expense", label: "Spendings" },
  { value: "income", label: "Income" },
];

const ORDER_OPTIONS = [
  { value: "az", label: "A - Z" },
  { value: "za", label: "Z - A" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-high", label: "Amount: High to Low" },
  { value: "amount-low", label: "Amount: Low to High" },
];

export const DEFAULT_FILTERS = {
  type: "all",
  categoryId: "all",
  amountMin: "",
  amountMax: "",
  dateStart: "",
  dateEnd: "",
  order: "az",
};

export default function FilterDrawer({
  open,
  onClose,
  categories = [],
  filters,
  onApply,
}) {
  const [local, setLocal] = useState(filters);
  // Se mantiene montado un instante extra para que la animación de salida
  // se vea completa antes de desaparecer del DOM
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setLocal(filters);
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300); // debe matchear la duration del transition
      return () => clearTimeout(timer);
    }
  }, [open, filters]);

  if (!mounted) return null;

  const set = (key) => (e) =>
    setLocal((prev) => ({ ...prev, [key]: e.target.value }));

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    setLocal(DEFAULT_FILTERS);
    onApply(DEFAULT_FILTERS);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 20,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Panel deslizante */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 270,
          bgcolor: "#fff",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          zIndex: 21,
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton size="small" onClick={onClose} sx={{ color: PRIMARY }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {/* Type */}
          <Box>
            <FieldLabel>Type</FieldLabel>
            <Select
              fullWidth
              value={local.type}
              onChange={set("type")}
              variant="standard"
              disableUnderline
              sx={pillSx}
            >
              {TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Category */}
          <Box>
            <FieldLabel>Category</FieldLabel>
            <Select
              fullWidth
              value={local.categoryId}
              onChange={set("categoryId")}
              variant="standard"
              disableUnderline
              sx={pillSx}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Amount */}
          <Box>
            <FieldLabel>Amount</FieldLabel>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#666" }}>$</Typography>
              <InputBase
                type="number"
                value={local.amountMin}
                onChange={set("amountMin")}
                sx={{ ...pillSx, flex: 1, justifyContent: "center" }}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                color: "#888",
                fontSize: "0.8rem",
                my: 0.5,
              }}
            >
              to
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#666" }}>$</Typography>
              <InputBase
                type="number"
                value={local.amountMax}
                onChange={set("amountMax")}
                sx={{ ...pillSx, flex: 1, justifyContent: "center" }}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Box>
          </Box>

          {/* Date */}
          <Box>
            <FieldLabel>Date</FieldLabel>
            <Box sx={{ ...pillSx, justifyContent: "space-between" }}>
              <InputBase
                type="date"
                value={local.dateStart}
                onChange={set("dateStart")}
                sx={{ flex: 1, fontSize: "0.8rem" }}
              />
              <CalendarTodayIcon sx={{ fontSize: 16, color: PRIMARY }} />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                color: "#888",
                fontSize: "0.8rem",
                my: 0.5,
              }}
            >
              to
            </Typography>
            <Box sx={{ ...pillSx, justifyContent: "space-between" }}>
              <InputBase
                type="date"
                value={local.dateEnd}
                onChange={set("dateEnd")}
                sx={{ flex: 1, fontSize: "0.8rem" }}
              />
              <CalendarTodayIcon sx={{ fontSize: 16, color: PRIMARY }} />
            </Box>
          </Box>

          {/* Order */}
          <Box>
            <FieldLabel>Order</FieldLabel>
            <Select
              fullWidth
              value={local.order}
              onChange={set("order")}
              variant="standard"
              disableUnderline
              sx={pillSx}
            >
              {ORDER_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
          <Button
            fullWidth
            onClick={handleClear}
            sx={{
              color: PRIMARY,
              border: `1.5px solid ${PRIMARY}`,
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            Clear
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            sx={{
              bgcolor: PRIMARY,
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#274b30" },
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </>
  );
}
