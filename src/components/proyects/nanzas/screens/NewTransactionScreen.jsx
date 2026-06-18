import { useState, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { colors } from "../colors";

const today = new Date().toISOString().split("T")[0];

const fieldSx = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d0d0",
  borderRadius: "10px",
  background: "#fff",
  fontSize: "14px",
  color: "#1a1a1a",
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
  WebkitAppearance: "none",
  boxSizing: "border-box",
};

const labelSx = {
  display: "block",
  fontSize: 12,
  color: "#555",
  mb: 0.6,
  cursor: "pointer",
};

export default function NewTransactionScreen({ onBack }) {
  const [tab, setTab] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [toast, setToast] = useState("");

  const allCategories = useMemo(() => {
    return JSON.parse(localStorage.getItem("nanzas_categories") || "[]");
  }, []);

  const availableCategories = useMemo(() => {
    return allCategories.filter((c) => c.type === tab);
  }, [allCategories, tab]);

  useEffect(() => {
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0].id.toString());
    } else {
      setCategory("");
    }
  }, [tab, availableCategories]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Función centralizada para limpiar el formulario
  const resetForm = () => {
    setAmount("");
    setDescription("");
    setDate(today);
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0].id.toString());
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!amount || parsedAmount <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    if (!date) {
      showToast("Select a date");
      return;
    }
    if (!category) {
      showToast("Select a category first");
      return;
    }

    const tx = {
      id: Date.now(),
      type: tab,
      categoryId: category,
      description: description.trim(),
      amount: Number(parsedAmount.toFixed(2)),
      date,
      createdAt: new Date().toISOString(),
    };

    const stored = JSON.parse(
      localStorage.getItem("nanzas_transactions") || "[]"
    );
    stored.unshift(tx);
    localStorage.setItem("nanzas_transactions", JSON.stringify(stored));

    showToast("Transaction saved ✓");
    onBack();
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setTab("expense");
    onBack();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSave}
      sx={{
        flex: 1,
        bgcolor: colors.surface,
        borderTopRightRadius: "20px",
        borderTopLeftRadius: "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        px: 2.5,
        pt: 2.5,
        pb: 2,
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ color: colors.primary, p: 0.3 }}
        >
          <ChevronLeft sx={{ fontSize: 22 }} />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
          New transaction
        </Typography>
      </Box>

      {/* ── Tabs ── */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "#c8d9b0",
          borderRadius: "10px",
          p: "4px",
          gap: "4px",
          mb: 2.5,
        }}
      >
        {["expense", "income"].map((t) => (
          <Box
            key={t}
            onClick={() => setTab(t)}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              py: "9px",
              borderRadius: "8px",
              cursor: "pointer",
              bgcolor: tab === t ? colors.primary : "transparent",
              color: tab === t ? "#fff" : "#3a5a1c",
              fontWeight: 500,
              fontSize: "14px",
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: 15 }}>{t === "expense" ? "↓" : "↑"}</span>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Box>
        ))}
      </Box>

      {/* ── Category ── */}
      <Box sx={{ mb: 2 }}>
        <Typography component="label" sx={labelSx}>
          Category
        </Typography>
        <FormControl fullWidth>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={availableCategories.length === 0}
            displayEmpty
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d0d0" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#a0a0a0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
                borderWidth: "1px",
              },
              "& .MuiSelect-select": {
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: "24px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "12px",
                  mt: 0.5,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                  bgcolor: "#fff",
                },
              },
            }}
          >
            {availableCategories.length === 0 ? (
              <MenuItem value="" disabled sx={{ fontSize: 14 }}>
                No categories created
              </MenuItem>
            ) : (
              availableCategories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id.toString()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: colors.primary,
                      WebkitMaskImage: `url("${c.icon}")`,
                      maskImage: `url("${c.icon}")`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: "#111" }}>
                    {c.name}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>

      {/* ── Description ── */}
      <Box sx={{ mb: 2 }}>
        <Typography component="label" htmlFor="desc-input" sx={labelSx}>
          Description
        </Typography>
        <input
          id="desc-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={fieldSx}
        />
      </Box>

      {/* ── Amount + Date ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography component="label" htmlFor="amount-input" sx={labelSx}>
            Amount
          </Typography>
          <input
            id="amount-input"
            type="number"
            value={amount}
            min="0"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            style={fieldSx}
          />
        </Box>
        <Box>
          <Typography component="label" htmlFor="date-input" sx={labelSx}>
            Date
          </Typography>
          <input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={fieldSx}
          />
        </Box>
      </Box>

      {/* ── Buttons ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mt: 1,
        }}
      >
        <Box
          onClick={handleCancel}
          sx={{
            py: "13px",
            textAlign: "center",
            borderRadius: "12px",
            cursor: "pointer",
            bgcolor: "#e8e8e8",
            border: "1px solid #ccc",
            fontSize: "14px",
            fontWeight: 500,
            color: "#555",
          }}
        >
          Cancel
        </Box>
        <Box
          component="button" // Convertido a botón real para submit
          type="submit"
          sx={{
            py: "13px",
            textAlign: "center",
            borderRadius: "12px",
            cursor: "pointer",
            bgcolor: colors.primary,
            fontSize: "14px",
            fontWeight: 500,
            color: "#fff",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            "&:active": { opacity: 0.8 },
          }}
        >
          Save
        </Box>
      </Box>

      {/* ── Toast ── */}
      {toast && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: colors.error,
            color: "#fff",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: 12,
            whiteSpace: "nowrap",
            zIndex: 99,
          }}
        >
          {toast}
        </Box>
      )}
    </Box>
  );
}
