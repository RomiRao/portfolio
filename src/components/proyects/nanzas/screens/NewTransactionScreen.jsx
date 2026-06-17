import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { colors } from "../colors";

const CATEGORIES = [
  { value: "car", label: "🚗 Car" },
  { value: "food", label: "🍔 Food" },
  { value: "health", label: "💊 Health" },
  { value: "home", label: "🏠 Home" },
  { value: "entertainment", label: "🎬 Entertainment" },
  { value: "pets", label: "🐾 Pets" },
  { value: "salary", label: "💼 Salary" },
  { value: "gifts", label: "🎁 Gifts" },
  { value: "other", label: "📦 Other" },
];

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

export default function NewTransactionScreen({ onBack }) {
  const [tab, setTab] = useState("expense");
  const [category, setCategory] = useState("car");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    if (!date) {
      showToast("Select a date");
      return;
    }
    const tx = {
      id: Date.now(),
      type: tab,
      category,
      description,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      date,
      createdAt: new Date().toISOString(),
    };
    const stored = JSON.parse(
      localStorage.getItem("nanzas_transactions") || "[]"
    );
    stored.unshift(tx);
    localStorage.setItem("nanzas_transactions", JSON.stringify(stored));
    showToast("Transaction saved ✓");
    setAmount("");
    setDescription("");
    setCategory("car");
    setDate(today);
  };

  const handleCancel = () => {
    setAmount("");
    setDescription("");
    setCategory("car");
    setDate(today);
    setTab("expense");
    onBack();
  };

  return (
    <Box
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
      <Typography sx={{ fontSize: 12, color: "#555", mb: 0.6 }}>
        Category
      </Typography>
      <Box sx={{ position: "relative", mb: 2 }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            ...fieldSx,
            paddingRight: "32px",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Box>

      {/* ── Description ── */}
      <Typography sx={{ fontSize: 12, color: "#555", mb: 0.6 }}>
        Description
      </Typography>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...fieldSx, marginBottom: 16 }}
      />

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
          <Typography sx={{ fontSize: 12, color: "#555", mb: 0.6 }}>
            Amount
          </Typography>
          <input
            type="number"
            value={amount}
            min="0"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            style={fieldSx}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12, color: "#555", mb: 0.6 }}>
            Date
          </Typography>
          <input
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
          onClick={handleSave}
          sx={{
            py: "13px",
            textAlign: "center",
            borderRadius: "12px",
            cursor: "pointer",
            bgcolor: colors.primary,
            fontSize: "14px",
            fontWeight: 500,
            color: "#fff",
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
