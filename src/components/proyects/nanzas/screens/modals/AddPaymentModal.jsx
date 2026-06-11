import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../colors.js";

const FALLBACK_CATEGORIES = [
  "Services",
  "Housing",
  "Transport",
  "Food",
  "Health",
  "Other",
];

function getCategories() {
  const dedicated = localStorage.getItem("nanzas_categories");
  if (dedicated) {
    try {
      const parsed = JSON.parse(dedicated);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  const payments = localStorage.getItem("nanzas_payments");
  if (payments) {
    try {
      const parsed = JSON.parse(payments);
      const unique = [
        ...new Set(parsed.map((p) => p.category).filter(Boolean)),
      ];
      if (unique.length > 0) return unique;
    } catch {}
  }

  // 3. Fallback
  return FALLBACK_CATEGORIES;
}

export default function AddPaymentModal({ open, onClose, onAdd, initialData }) {
  const [label, setLabel] = useState(initialData?.name ?? "");
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? getCategories()[0]
  );
  const categories = useMemo(() => getCategories(), [open]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!label.trim()) newErrors.label = "Label is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    return newErrors;
  };

  const handleAdd = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd({
      id: Date.now(),
      name: label.trim(),
      category,
      amount: Number(amount),
      paid: false,
    });
    handleClose();
  };

  const handleClose = () => {
    setLabel("");
    setCategory("Services");
    setAmount("");
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (open) {
      setLabel(initialData?.name ?? "");
      setAmount(initialData?.amount?.toString() ?? "");
      setCategory(initialData?.category ?? getCategories()[0]);
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <Box
      onClick={handleClose}
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      {/* Panel — detiene propagación para no cerrar al hacer click adentro */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: colors.surface,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          px: 2.5,
          pt: 2.5,
          pb: 3,
          width: "100%",
          boxShadow: "0px -4px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ width: 28 }} /> {/* espaciador izquierdo */}
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 800,
              color: colors.primary,
              flex: 1,
              textAlign: "center",
            }}
          >
            {initialData ? "Edit payment item" : "New payment item"}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: colors.textMuted, p: 0.25 }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* LABEL */}
        <Box sx={{ mb: 1.75 }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}
          >
            Label
          </Typography>
          <TextField
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              if (errors.label) setErrors((p) => ({ ...p, label: null }));
            }}
            placeholder="e.g. Netflix, Rent..."
            fullWidth
            size="small"
            error={!!errors.label}
            helperText={errors.label}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: 13,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.primary },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
                color: "#1a1a1a",
              },
              "& .MuiFormHelperText-root": { fontSize: 10, mt: 0.25 },
            }}
          />
        </Box>

        {/* CATEGORY */}
        <Box sx={{ mb: 1.75 }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}
          >
            Category
          </Typography>
          <Box
            component="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              width: "100%",
              fontSize: 13,
              color: "#1a1a1a",
              bgcolor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              px: 1.5,
              py: "8.5px",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              cursor: "pointer",
              "&:focus": { borderColor: colors.primary, outline: "none" },
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Box>
        </Box>

        {/* AMOUNT */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}
          >
            Amount
          </Typography>
          <TextField
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors((p) => ({ ...p, amount: null }));
            }}
            placeholder="0.00"
            fullWidth
            size="small"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            error={!!errors.amount}
            helperText={errors.amount}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: 13,
                color: "#1a1a1a",
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.primary },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
              },
              "& .MuiFormHelperText-root": { fontSize: 10, mt: 0.25 },
            }}
          />
        </Box>

        {/* ADD BUTTON */}
        <Button
          onClick={handleAdd}
          fullWidth
          sx={{
            bgcolor: colors.primary,
            borderRadius: "12px",
            py: 1.2,
            textTransform: "none",
            "&:hover": { bgcolor: colors.primary, opacity: 0.9 },
          }}
        >
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: colors.surface }}
          >
            {initialData ? "Save changes" : "Add"}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
