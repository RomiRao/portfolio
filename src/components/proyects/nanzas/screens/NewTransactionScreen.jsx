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
import downIcon from "../../../../assets/icons/down-icon.svg";
import upIcon from "../../../../assets/icons/up-icon.svg";

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

export default function NewTransactionScreen({ onBack, params }) {
  const [tab, setTab] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [toast, setToast] = useState("");

  const allCategories = useMemo(() => {
    return JSON.parse(localStorage.getItem("nanzas_categories") || "[]");
  }, []);

  useEffect(() => {
    if (params?.editId) {
      const stored = JSON.parse(
        localStorage.getItem("nanzas_transactions") || "[]",
      );
      const txToEdit = stored.find((t) => t.id === params.editId);

      if (txToEdit) {
        setTab(txToEdit.type);
        setCategory(txToEdit.categoryId.toString());
        setDescription(txToEdit.description || "");
        setAmount(txToEdit.amount.toString());
        setDate(txToEdit.date);
      }
    }
  }, [params]);

  const availableCategories = useMemo(() => {
    return allCategories.filter((c) => c.type === tab);
  }, [allCategories, tab]);

  useEffect(() => {
    if (!params?.editId && availableCategories.length > 0) {
      setCategory(availableCategories[0].id.toString());
    }
  }, [tab, availableCategories, params]);

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

    const stored = JSON.parse(
      localStorage.getItem("nanzas_transactions") || "[]",
    );

    if (params?.editId) {
      // MODO EDICIÓN: Actualizar el existente
      const updatedList = stored.map((t) =>
        t.id === params.editId
          ? {
              ...t,
              type: tab,
              categoryId: category,
              description: description.trim(),
              amount: Number(parsedAmount.toFixed(2)),
              date,
            }
          : t,
      );
      localStorage.setItem("nanzas_transactions", JSON.stringify(updatedList));
      showToast("Transaction updated ✓");
    } else {
      // MODO NUEVO: Agregar al inicio
      const tx = {
        id: Date.now(),
        type: tab,
        categoryId: category,
        description: description.trim(),
        amount: Number(parsedAmount.toFixed(2)),
        date,
        createdAt: new Date().toISOString(),
      };
      stored.unshift(tx);
      localStorage.setItem("nanzas_transactions", JSON.stringify(stored));
      showToast("Transaction saved ✓");
    }

    // Retraso para que el usuario vea el mensaje antes de volver
    setTimeout(() => {
      onBack();
      resetForm();
    }, 1000);
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
        gap: 4,
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ color: colors.primary, p: 0.3 }}
        >
          <ChevronLeft sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 600,
            color: colors.primary,
            textAlign: "center",
            width: "100%",
          }}
        >
          {params?.editId ? "Edit transaction" : "New transaction"}
        </Typography>
      </Box>

      {/* ── Tabs ── */}
      <Box
        sx={{
          display: "flex",
          bgcolor: colors.light,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {[
          { key: "expense", label: "Expense", icon: downIcon },
          { key: "income", label: "Income", icon: upIcon },
        ].map(({ key, label, icon }) => (
          <Box
            key={key}
            onClick={() => setTab(key)}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              py: 1,
              px: 3,

              cursor: "pointer",
              bgcolor: tab === key ? colors.primary : colors.bgGreen,
              transition: "all 0.15s ease",
            }}
          >
            <img
              src={icon}
              alt={label}
              style={{
                width: "18px",
                height: "18px",
                filter: tab === key ? "brightness(0) invert(1)" : "none",
                transition: "filter 0.15s ease",
              }}
            />
            <span
              style={{
                fontWeight: 500,
                fontSize: "15px",
                color: tab === key ? colors.surface : colors.primary,
                transition: "color 0.15s ease",
              }}
            >
              {label}
            </span>
          </Box>
        ))}
      </Box>

      {/* ── Category ── */}
      <Box>
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
      <Box>
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
          gap: 1,
          mt: 1,
        }}
      >
        <Box
          onClick={handleCancel}
          sx={{
            py: 1,
            px: 2,
            textAlign: "center",
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: colors.bgGreen,

            fontSize: "14px",
            fontWeight: 600,
            color: colors.primary,
          }}
        >
          Cancel
        </Box>
        <Box
          component="button"
          type="submit"
          sx={{
            py: 1,
            px: 2,
            textAlign: "center",
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: colors.primary,
            fontSize: "14px",
            fontWeight: 600,
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
