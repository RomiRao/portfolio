import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, MenuItem, Select } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { ChevronLeft } from "@mui/icons-material";
import { colors } from "../colors.js";

const DEFAULT_CARDS = [
  {
    id: 1,
    type: "AMEX",
    bank: "Bank",
    number: "4539148275935084",
    cutoff: "07",
    expire: "30",
    balance: 0,
    theme: "dark",
  },
  {
    id: 2,
    type: "AMEX",
    bank: "Bank",
    number: "4539148275935084",
    cutoff: "07",
    expire: "30",
    balance: 0,
    theme: "light",
  },
];

const TYPE_OPTIONS = [
  "Single payment",
  "Installment payment",
  "Automatic debit",
];

const fieldLabelSx = {
  display: "block",
  fontSize: 12,
  color: "#555",
  mb: 0.6,
  cursor: "pointer",
};

const fieldBoxSx = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d0d0",
  borderRadius: 2,
  background: "#fff",
  fontSize: 12,
  color: "#1a1a1a",
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
  WebkitAppearance: "none",
  boxSizing: "border-box",
  gap: 1,
};

const selectSx = {
  fontSize: 14,
  color: "#1b1b1b",
  "& .MuiSelect-select": {
    py: 0,
    color: "#1b1b1b",
  },
  "& .MuiSvgIcon-root": {
    color: colors.primary,
  },
};

const menuItemSx = {
  fontSize: 14,
  color: "#1b1b1b",
};

export default function NewCardExpenseScreen({ onBack, params }) {
  const [showNoCardsModal, setShowNoCardsModal] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cardId, setCardId] = useState("");
  const [type, setType] = useState("Installment payment");
  const [installments, setInstallments] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [cardOptions, setCardOptions] = useState([]);

  // Carga de categorías y tarjetas desde localStorage al montar el componente
  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem("nanzas_categories");
      const parsedCategories = storedCategories
        ? JSON.parse(storedCategories)
        : [];
      setCategoryOptions(
        Array.isArray(parsedCategories) ? parsedCategories : [],
      );

      if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
        setCategory(parsedCategories[0].name ?? parsedCategories[0]);
      }
    } catch (error) {
      console.error("Error leyendo nanzas_categories de localStorage:", error);
      setCategoryOptions([]);
    }

    try {
      const storedCards = localStorage.getItem("nanzas_cards");

      if (storedCards === null) {
        // No existe la key: guardamos tarjetas por defecto y seguimos normal
        localStorage.setItem("nanzas_cards", JSON.stringify(DEFAULT_CARDS));
        setCardOptions(DEFAULT_CARDS);
        setCardId(DEFAULT_CARDS[0].id);
      } else {
        const parsedCards = JSON.parse(storedCards);
        const cardsArray = Array.isArray(parsedCards) ? parsedCards : [];

        if (cardsArray.length === 0) {
          // Key existe pero está vacía: mostramos el modal
          setShowNoCardsModal(true);
        } else {
          setCardOptions(cardsArray);
          const firstCard = cardsArray[0];
          setCardId(firstCard?.id ?? firstCard?.bank ?? firstCard);
        }
      }
    } catch (error) {
      console.error("Error leyendo nanzas_cards de localStorage:", error);
      setCardOptions([]);
      setShowNoCardsModal(true);
    }
  }, []);

  const handleCloseNoCardsModal = () => {
    setShowNoCardsModal(false);
    onBack?.();
  };

  const handleSave = () => {
    const newExpense = {
      description,
      category,
      cardId,
      type,
      installments: type === "Installment payment" ? installments : null,
      amount: Number(amount) || 0,
      date,
    };

    try {
      const storedExpenses = localStorage.getItem("nanzas_card_expenses");
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      const updatedExpenses = Array.isArray(expenses)
        ? [...expenses, newExpense]
        : [newExpense];

      localStorage.setItem(
        "nanzas_card_expenses",
        JSON.stringify(updatedExpenses),
      );
    } catch (error) {
      console.error("Error guardando el gasto en localStorage:", error);
    }

    onBack?.();
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: colors.surface,
        overflow: "hidden",

        borderTopRightRadius: "20px",
        borderTopLeftRadius: "20px",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
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
          New Card Expense
        </Typography>
      </Box>

      {/* Contenido con scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 2.5,
        }}
      >
        {/* Description */}
        <Box>
          <Typography sx={fieldLabelSx}>Description</Typography>
          <Box sx={fieldBoxSx}>
            <DescriptionOutlinedIcon
              sx={{ fontSize: 18, color: colors.primary }}
            />
            <Box
              component="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Clothes"
              sx={{
                border: "none",
                outline: "none",
                flex: 1,
                fontSize: 14,
                bgcolor: "transparent",
                fontFamily: "inherit",
                color: "#1b1b1b",
                "&::placeholder": { color: "#9aa79b" },
              }}
            />
          </Box>
        </Box>

        {/* Category */}
        <Box>
          <Typography sx={fieldLabelSx}>Category</Typography>
          <Box sx={fieldBoxSx}>
            <CategoryOutlinedIcon
              sx={{ fontSize: 18, color: colors.primary }}
            />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="standard"
              disableUnderline
              fullWidth
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: "#fff" },
                },
              }}
            >
              {categoryOptions.map((opt) => {
                const value = opt?.name ?? opt;
                const key = opt?.id ?? opt?.name ?? opt;
                return (
                  <MenuItem key={key} value={value} sx={menuItemSx}>
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Box>

        {/* Card */}
        <Box>
          <Typography sx={fieldLabelSx}>Card</Typography>
          <Box sx={fieldBoxSx}>
            <CreditCardOutlinedIcon
              sx={{ fontSize: 18, color: colors.primary }}
            />
            <Select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              variant="standard"
              disableUnderline
              fullWidth
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: "#fff" },
                },
              }}
            >
              {cardOptions.map((opt) => {
                const isObj = typeof opt === "object" && opt !== null;

                // CAMBIO CLAVE: El value ahora es estrictamente el id único de la tarjeta
                const value = isObj ? (opt.id ?? opt.bank ?? "") : opt;
                const key = opt?.id ?? value;

                const label = isObj
                  ? `${opt.bank}${opt.number ? ` - *${String(opt.number).slice(-4)}` : ""}`
                  : opt;
                return (
                  <MenuItem key={key} value={value} sx={menuItemSx}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Box>

        {/* Type */}
        <Box>
          <Typography sx={fieldLabelSx}>Type</Typography>
          <Box sx={fieldBoxSx}>
            <RepeatOutlinedIcon sx={{ fontSize: 18, color: colors.primary }} />
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              variant="standard"
              disableUnderline
              fullWidth
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: "#fff" },
                },
              }}
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt} sx={menuItemSx}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Number of installments */}
        {type === "Installment payment" && (
          <Box>
            <Typography sx={fieldLabelSx}>Number of installments</Typography>
            <Box sx={fieldBoxSx}>
              <TagOutlinedIcon sx={{ fontSize: 18, color: colors.primary }} />
              <Box
                component="input"
                type="number"
                min={1}
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                placeholder="Ej: 3"
                sx={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  width: "100%",
                  fontSize: 14,
                  bgcolor: "transparent",
                  fontFamily: "inherit",
                  color: "#1b1b1b",
                  "&::placeholder": { color: "#9aa79b" },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Amount + Date */}
        <Box sx={{ display: "flex", gap: 1, width: " 100%" }}>
          <Box sx={{ width: " 100%" }}>
            <Typography sx={fieldLabelSx}>Amount</Typography>
            <Box sx={fieldBoxSx}>
              <AttachMoneyOutlinedIcon
                sx={{ fontSize: 18, color: colors.primary }}
              />
              <Box
                component="input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                sx={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: 14,
                  bgcolor: "transparent",
                  fontFamily: "inherit",
                  color: "#1b1b1b",
                  "&::placeholder": { color: "#9aa79b" },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ width: " 100%" }}>
            <Typography sx={fieldLabelSx}>Date</Typography>
            <Box sx={fieldBoxSx}>
              {/* <EventOutlinedIcon sx={{ fontSize: 18, color: colors.primary }} /> */}
              <Box
                component="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{
                  border: "none",
                  outline: "none",

                  fontSize: 13,
                  bgcolor: "transparent",
                  fontFamily: "inherit",
                  color: "#1b1b1b",
                  width: "100%",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Botones Cancel / Save */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, mb: 2 }}>
          <Box
            onClick={onBack}
            sx={{
              py: 0.9,
              px: 2,
              textAlign: "center",
              borderRadius: 1.3,
              cursor: "pointer",
              bgcolor: colors.bgGreen,
              width: "100%",
              fontSize: 12,
              fontWeight: 600,
              color: colors.primary,
            }}
          >
            Cancel
          </Box>
          <Box
            onClick={handleSave}
            sx={{
              py: 0.9,
              px: 2,
              textAlign: "center",
              borderRadius: 1.3,
              cursor: "pointer",
              width: "100%",
              bgcolor: colors.primary,
              fontSize: 12,
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
      </Box>
      {showNoCardsModal && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
          }}
        >
          <Box
            sx={{
              width: "85%",
              bgcolor: "#fff",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <CreditCardOutlinedIcon
              sx={{ fontSize: 36, color: colors.primary, mb: 1 }}
            />
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.primary,
                mb: 0.5,
              }}
            >
              No hay tarjetas registradas
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#666", mb: 2.5 }}>
              Agregá una tarjeta primero para poder registrar un gasto.
            </Typography>
            <Box
              onClick={handleCloseNoCardsModal}
              sx={{
                py: 1,
                px: 2,
                textAlign: "center",
                borderRadius: 1.5,
                cursor: "pointer",
                bgcolor: colors.primary,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                "&:active": { opacity: 0.8 },
              }}
            >
              Entendido
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
