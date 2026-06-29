import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  TextField,
  Portal,
  Select,
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { colors } from "../../nanzas/colors";
import MonthlyExpensesChart from "./MontlyExpensesChart";
import { ChevronLeft } from "@mui/icons-material";

const CARDS_STORAGE_KEY = "nanzas_cards";
const EXPENSES_STORAGE_KEY = "nanzas_card_expenses";

// --- Array por defecto ---
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

function maskCardNumber(number) {
  const digits = String(number ?? "");
  const last4 = digits.slice(-4);
  return { masked: "•••• •••• ••••", last4 };
}

function loadCardsFromStorage() {
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
      return DEFAULT_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
    return DEFAULT_CARDS;
  } catch (e) {
    return DEFAULT_CARDS;
  }
}

// --- COMPONENTE DEL MODAL ---
function CardModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  containerRef,
  editingCard,
}) {
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cutoff, setCutoff] = useState("");
  const [expire, setExpire] = useState("");

  // Precargar datos si estamos en modo edición
  useEffect(() => {
    if (editingCard && isOpen) {
      setBank(editingCard.bank || "");
      setCardNumber(editingCard.number || "");
      setCutoff(editingCard.cutoff || "");
      setExpire(editingCard.expire || "");
    } else if (isOpen && !editingCard) {
      setBank("");
      setCardNumber("");
      setCutoff("");
      setExpire("");
    }
  }, [editingCard, isOpen]);

  if (!isOpen) return null;

  const isFormValid =
    bank.trim() !== "" &&
    cardNumber.trim() !== "" &&
    cutoff.trim() !== "" &&
    expire.trim() !== "";

  const handleCardNumberChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const limitedNumbers = onlyNumbers.substring(0, 16);
    const formattedCardNumber = limitedNumbers
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
    setCardNumber(formattedCardNumber);
  };

  const handleSave = () => {
    if (!isFormValid) return;
    onSave({
      id: editingCard?.id, // Pasamos el ID si existe
      bank,
      cardNumber: cardNumber.replace(/\s/g, ""), // Guardamos sin espacios
      cutoff,
      expire,
    });
  };

  const handleDeleteClick = () => {
    if (!editingCard) return;

    // Lógica para validar si tiene gastos del mes corriente en adelante
    try {
      const rawExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const expenses = rawExpenses ? JSON.parse(rawExpenses) : [];

      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();

      // Asumimos que los gastos guardados tienen { cardId, date: "YYYY-MM-DD" }
      const hasFutureOrCurrentExpenses = expenses.some((exp) => {
        if (exp.cardId !== editingCard.id) return false;

        const expDate = new Date(exp.date);
        const expYear = expDate.getFullYear();
        const expMonth = expDate.getMonth();

        if (expYear > currentYear) return true;
        if (expYear === currentYear && expMonth >= currentMonth) return true;

        return false;
      });

      if (hasFutureOrCurrentExpenses) {
        alert(
          "You cannot delete this card because there are expenses linked to it from the current month onwards.",
        );
        return;
      }

      // Si pasa la validación, procedemos a borrar
      onDelete(editingCard.id);
    } catch (e) {
      console.error("Error reading expenses", e);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      color: colors.black,
      height: "45px",
      "& fieldset": { borderColor: "#689c6d" },
      "& hover fieldset": { borderColor: colors.primary },
      "&.Mui-focused fieldset": { borderColor: colors.primary },
    },
    "& input": { fontSize: 14, fontFamily: "inherit" },
  };

  const labelStyles = {
    fontSize: 12,
    fontWeight: 600,
    color: colors.primary,
    mb: 0.5,
  };

  return (
    <Portal container={containerRef?.current || containerRef}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-end",
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
          overflow: "hidden",
        }}
        onClick={onClose}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            p: 3,
            pb: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: colors.primary,
              fontSize: 18,
              mb: 1,
            }}
          >
            {editingCard ? "Edit card" : "New card"}
          </Typography>

          <Box>
            <Typography sx={labelStyles}>Bank/ virtual wallet</Typography>
            <TextField
              fullWidth
              placeholder="Ej: Clothes"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              sx={inputStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>Card number</Typography>
            <TextField
              fullWidth
              placeholder="Ej: 2034 3839 2637 1049"
              value={cardNumber}
              onChange={handleCardNumberChange}
              type="tel"
              sx={inputStyles}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={labelStyles}>Day of cut-off</Typography>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 1, max: 31 }}
                placeholder="Ej: 10"
                value={cutoff}
                onChange={(e) => setCutoff(e.target.value)}
                sx={inputStyles}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={labelStyles}>Day of expiration</Typography>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 1, max: 31 }}
                placeholder="Ej: 20"
                value={expire}
                onChange={(e) => setExpire(e.target.value)}
                sx={inputStyles}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              fullWidth
              onClick={onClose}
              sx={{
                py: 0.6,
                px: 2,
                textAlign: "center",
                borderRadius: 1.3,
                cursor: "pointer",
                bgcolor: colors.bgGreen,
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSave}
              disabled={!isFormValid}
              sx={{
                py: 0.6,
                px: 2,
                textAlign: "center",
                borderRadius: 1.3,
                cursor: "pointer",
                bgcolor: colors.primary,
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
                "&:active": { opacity: 0.8 },
                textTransform: "none",
              }}
            >
              Save
            </Button>
          </Stack>

          {/* Botón de eliminar solo en modo edición */}
          {editingCard && (
            <Button
              fullWidth
              onClick={handleDeleteClick}
              sx={{
                py: 0.6,
                px: 2,
                textAlign: "center",
                borderRadius: 1.3,
                cursor: "pointer",
                bgcolor: "transparent",
                border: "1px solid #d32f2f",
                fontSize: 12,
                fontWeight: 600,
                color: "#d32f2f",
                fontFamily: "inherit",
                textTransform: "none",
              }}
            >
              Delete card
            </Button>
          )}
        </Box>
      </Box>
    </Portal>
  );
}

// --- PANTALLA PRINCIPAL ---
export default function CardsScreen({ onChange, onBack, phoneContainerRef }) {
  const chartData = [
    { month: "Jan", values: { auto: 20, inst: 70, one: 10 }, total: "$100" },
    { month: "Feb", values: { auto: 15, inst: 65, one: 10 }, total: "$90" },
    { month: "Mar", values: { auto: 20, inst: 50, one: 15 }, total: "$50" },
    { month: "Apr", values: { auto: 10, inst: 80, one: 5 }, total: "$450" },
    { month: "May", values: { auto: 25, inst: 50, one: 15 }, total: "$15" },
    { month: "Jun", values: { auto: 15, inst: 65, one: 10 }, total: "$20" },
  ];
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const totalBalance = useMemo(() => {
    let expenses = [];
    try {
      const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      expenses = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error leyendo gastos para calcular balance", e);
    }

    const relevantExpenses =
      selectedCardId === null || selectedCardId === "all"
        ? expenses
        : expenses.filter((exp) => exp.cardId === selectedCardId);

    return relevantExpenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0,
    );
  }, [selectedCardId, userCards]);

  useEffect(() => {
    setUserCards(loadCardsFromStorage());
  }, []);

  const handleOpenNewCard = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSaveCard = (cardData) => {
    let updatedCards = [];

    if (cardData.id) {
      // Editar tarjeta existente
      updatedCards = userCards.map((card) =>
        card.id === cardData.id
          ? {
              ...card,
              bank: cardData.bank,
              number: cardData.cardNumber,
              cutoff: cardData.cutoff,
              expire: cardData.expire,
            }
          : card,
      );
    } else {
      // Crear nueva tarjeta
      const newCard = {
        id: Date.now(),
        type: "VISA", // Por defecto, o puedes agregar un selector luego
        bank: cardData.bank,
        number: cardData.cardNumber,
        cutoff: cardData.cutoff,
        expire: cardData.expire,
        balance: 0,
        theme: userCards.length % 2 === 0 ? "dark" : "light",
      };
      updatedCards = [...userCards, newCard];
    }

    setUserCards(updatedCards);
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (id) => {
    const updatedCards = userCards.filter((card) => card.id !== id);
    setUserCards(updatedCards);
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
    setIsModalOpen(false);
    setEditingCard(null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        height: "100%",
        bgcolor: "#f4f6f4",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        display: "flex",
        flexDirection: "column",
        px: 1.5,
        pt: 3,
        overflow: "hidden",
        gap: 2,
      }}
    >
      {/* --- HEADER --- */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ color: colors.primary, p: 0.3 }}
        >
          <ChevronLeft sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1b4d22" }}>
          My cards
        </Typography>
      </Box>

      {/* --- CONTENEDOR SCROLEABLE --- */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pb: 4,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* --- BALANCE GENERAL --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            px: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 12, color: "#555", fontWeight: 500 }}>
              Total credit card balance
            </Typography>
            <Typography
              sx={{ fontSize: 28, fontWeight: 800, color: "#000", mt: -0.5 }}
            >
              ${totalBalance.toLocaleString("en-US")}
            </Typography>
          </Box>

          <Select
            value={selectedCardId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCardId(value === "all" ? null : value);
            }}
            IconComponent={ArrowDropDownIcon}
            variant="standard"
            disableUnderline
            sx={{
              backgroundColor: colors.bgLightGreen,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 600,
              color: colors.primary,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                py: "2px !important",
                pr: "20px !important",
              },
              "& .MuiSelect-icon": {
                color: colors.primary,
                fontSize: 18,
              },
              "&:before, &:after": { display: "none" },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  mt: 0.5,
                  bgcolor: "white",
                },
              },
            }}
          >
            <MenuItem
              value="all"
              sx={{ fontSize: 12, fontWeight: 600, color: colors.primary }}
            >
              All cards
            </MenuItem>

            {userCards.map((card) => {
              const { last4 } = maskCardNumber(card.number);
              return (
                <MenuItem
                  key={card.id}
                  value={card.id}
                  sx={{ fontSize: 12, fontWeight: 600, color: colors.primary }}
                >
                  {card.bank} - •••• {last4}
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        {/* --- GRÁFICO DE BARRAS APILADAS --- */}
        <MonthlyExpensesChart cardId={selectedCardId} />

        {/* --- BOTÓN ADD CARD EXPENSE --- */}
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Button
            onClick={() => onChange("cardexpense")}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: colors.primary,
              color: colors.surface,
              textTransform: "none",
              borderRadius: 2,

              mb: 2,
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            Add Card Expense
          </Button>
        </Box>
        {/* --- SECCIÓN CARDS --- */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            px: 1.5,
          }}
        >
          <Typography
            sx={{ fontWeight: 700, color: colors.gray, fontSize: 16 }}
          >
            Cards
          </Typography>

          <IconButton
            onClick={handleOpenNewCard} // Abre modal en modo "Nuevo"
            sx={{
              right: 0,
              border: 1.7,
              borderColor: colors?.primary || "#2d5a37",
              p: 0.2,
              width: 18,

              height: 18,
            }}
          >
            <Add sx={{ fontSize: 18, color: colors?.primary || "#2d5a37" }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            mt: 1.5,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "nowrap",
              width: "max-content",
            }}
          >
            {/* Renderizado dinámico de tarjetas */}
            {userCards.map((card) => {
              const isDark = card.theme === "dark";
              const bgColor = isDark ? "#35693c" : "#d8ebd9";
              const textColor = isDark ? "#fff" : "#689c6d";
              const { masked, last4 } = maskCardNumber(card.number);

              return (
                <Box
                  key={card.id}
                  onClick={() => handleEditCard(card)} // Habilita la edición al tocar
                  sx={{
                    width: 230,
                    flexShrink: 0,
                    height: 140,
                    bgcolor: bgColor,
                    borderRadius: "16px",
                    p: 2,
                    color: textColor,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      {card.type}{" "}
                      <Box
                        component="span"
                        sx={{ fontWeight: 400, opacity: 0.9 }}
                      >
                        {card.bank}
                      </Box>
                    </Typography>
                    <WifiIcon
                      sx={{
                        fontSize: 18,
                        transform: "rotate(90deg)",
                        opacity: 0.8,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 20, letterSpacing: 3, fontWeight: 700 }}
                    >
                      {masked}
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                      {last4}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 9,
                          opacity: 0.9,
                          mb: 0.5,
                          lineHeight: 1.2,
                        }}
                      >
                        Monthly cut-off date:
                        <br />
                        {card.cutoff}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 9, opacity: 0.9, lineHeight: 1.2 }}
                      >
                        Expire date:
                        <br />
                        {card.expire}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: 10, opacity: 0.9 }}>
                        Balance
                      </Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
                        ${card.balance}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {/* Tarjeta (Botón para agregar una nueva tarjeta física) */}
            <Box
              onClick={handleOpenNewCard} // Abre Modal en modo "Nuevo"
              sx={{
                width: 290,
                flexShrink: 0,
                height: 140,
                bgcolor: "#859385",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: "5px solid #2e5334",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddIcon
                  sx={{ color: "#2e5334", fontSize: 40, fontWeight: "bold" }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Renderizamos el Modal al final pero dentro de CardsScreen */}
      <CardModal
        isOpen={isModalOpen}
        editingCard={editingCard}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
        containerRef={phoneContainerRef}
      />
    </Box>
  );
}
