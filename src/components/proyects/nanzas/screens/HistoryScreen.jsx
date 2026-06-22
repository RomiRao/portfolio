import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import { colors } from "../colors";
import TransactionItem from "./TransactionItem";
import FilterDrawer, { DEFAULT_FILTERS } from "./modals/FilterDrawer";

import transactionIcon from "../../../../assets/icons/transaction-icon.svg";

const COLORS = {
  background: "#edf3ee",
  primary: "#34623f",
  white: "#ffffff",
  textMain: "#2d3732",
};

const TYPE_LABELS = { expense: "Spendings", income: "Income" };
const ORDER_LABELS = {
  az: "A - Z",
  za: "Z - A",
  newest: "Newest first",
  oldest: "Oldest first",
  "amount-high": "Amount: High to Low",
  "amount-low": "Amount: Low to High",
};

function CategoryIcon() {
  return <img src={transactionIcon} alt="transaction" width={20} height={20} />;
}

export default function HistoryScreen({ onBack, onChange, phoneContainerRef }) {
  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem("nanzas_transactions");
    return savedData ? JSON.parse(savedData) : [];
  });

  const allCategories = JSON.parse(
    localStorage.getItem("nanzas_categories") || "[]"
  );

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTx, setMenuTx] = useState(null);

  const handleDelete = (id) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    localStorage.setItem("nanzas_transactions", JSON.stringify(updated));
    setTransactions(updated);
    setMenuAnchor(null);
  };

  // ── Chips derivados de los filtros realmente aplicados ──
  const categoryName = (id) =>
    allCategories.find((c) => c.id.toString() === id)?.name;

  const chips = [];
  if (filters.type !== "all") {
    chips.push({ key: "type", label: TYPE_LABELS[filters.type] });
  }
  if (filters.categoryId !== "all") {
    chips.push({
      key: "categoryId",
      label: categoryName(filters.categoryId) || "Category",
    });
  }
  if (filters.amountMin !== "" || filters.amountMax !== "") {
    chips.push({
      key: "amount",
      label: `$${filters.amountMin || 0} - $${filters.amountMax || "∞"}`,
    });
  }
  if (filters.dateStart || filters.dateEnd) {
    chips.push({
      key: "date",
      label: `${filters.dateStart || "…"} to ${filters.dateEnd || "…"}`,
    });
  }

  const handleDeleteFilter = (key) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (key === "type") next.type = DEFAULT_FILTERS.type;
      if (key === "categoryId") next.categoryId = DEFAULT_FILTERS.categoryId;
      if (key === "amount") {
        next.amountMin = DEFAULT_FILTERS.amountMin;
        next.amountMax = DEFAULT_FILTERS.amountMax;
      }
      if (key === "date") {
        next.dateStart = DEFAULT_FILTERS.dateStart;
        next.dateEnd = DEFAULT_FILTERS.dateEnd;
      }
      return next;
    });
  };

  // ── Filtrado + orden aplicado a la lista ──
  const filteredTransactions = transactions.filter((tx) => {
    if (filters.type !== "all" && tx.type !== filters.type) return false;
    if (
      filters.categoryId !== "all" &&
      tx.categoryId?.toString() !== filters.categoryId
    )
      return false;
    if (
      filters.amountMin !== "" &&
      Number(tx.amount) < Number(filters.amountMin)
    )
      return false;
    if (
      filters.amountMax !== "" &&
      Number(tx.amount) > Number(filters.amountMax)
    )
      return false;
    if (filters.dateStart) {
      const s = new Date(filters.dateStart + "T00:00:00");
      if (new Date(tx.date + "T00:00:00") < s) return false;
    }
    if (filters.dateEnd) {
      const e = new Date(filters.dateEnd + "T00:00:00");
      if (new Date(tx.date + "T00:00:00") > e) return false;
    }
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (filters.order) {
      case "az":
        return (a.description || "").localeCompare(b.description || "");
      case "za":
        return (b.description || "").localeCompare(a.description || "");
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "amount-high":
        return Number(b.amount) - Number(a.amount);
      case "amount-low":
        return Number(a.amount) - Number(b.amount);
      default:
        return 0;
    }
  });

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
      <Box sx={{ width: "100%" }}>
        {/* --- HEADER --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={onBack} sx={{ color: COLORS.primary, p: 0 }}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="h5"
              component="h1"
              sx={{ color: COLORS.primary, fontWeight: "bold" }}
            >
              History
            </Typography>
          </Box>
          <IconButton
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ color: COLORS.primary }}
          >
            <TuneIcon />
          </IconButton>
        </Box>

        {/* --- FILTROS (CHIPS) --- */}
        {chips.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2.5 }}>
            {chips.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => handleDeleteFilter(filter.key)}
                sx={{
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: "26px",
                  "& .MuiChip-deleteIcon": {
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "14px",
                    "&:hover": { color: COLORS.white },
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* --- CONTENEDOR DE TRANSACCIONES --- */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: COLORS.white,
            borderRadius: "24px",
            p: 2,
            mb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {transactions.length === 0 ? (
            <Box
              sx={{
                color: "#aaa",
                textAlign: "center",
                py: 2,
                border: "1px dashed #ccc",
                borderRadius: 2,
                fontSize: "0.85rem",
              }}
            >
              No transactions added.
            </Box>
          ) : sortedTransactions.length === 0 ? (
            <Box
              sx={{
                color: "#aaa",
                textAlign: "center",
                py: 2,
                border: "1px dashed #ccc",
                borderRadius: 2,
                fontSize: "0.85rem",
              }}
            >
              No transactions match these filters.
            </Box>
          ) : (
            sortedTransactions.map((tx) => {
              const cat = allCategories.find(
                (c) => c.id.toString() === tx.categoryId?.toString()
              );
              return (
                <TransactionItem
                  key={tx.id}
                  icon={
                    cat ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <CategoryIcon />
                    )
                  }
                  iconBg={cat?.color || colors.primary}
                  title={tx.description}
                  sub={
                    cat?.name
                      ? `${cat.name} • ${tx.date}`
                      : `General • ${tx.date}`
                  }
                  amount={`${tx.type === "expense" ? "-" : "+"}$${tx.amount}`}
                  onMenuClick={(e) => {
                    setMenuAnchor(e.currentTarget);
                    setMenuTx(tx);
                  }}
                />
              );
            })
          )}

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: "12px",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
                  minWidth: 130,
                  bgcolor: "#fff",
                  backgroundImage: "none",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                onChange("newtransaction", { editId: menuTx?.id });
                setMenuAnchor(null);
              }}
              sx={{ fontSize: 13, color: "#1a1a1a", gap: 1 }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => handleDelete(menuTx?.id)}
              sx={{ color: colors.error }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Paper>

        {/* --- BOTÓN DE NUEVA TRANSACCIÓN --- */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onChange("newtransaction")}
            sx={{
              bgcolor: COLORS.primary,
              color: COLORS.white,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 0.8,
              fontWeight: 500,
              fontSize: "0.85rem",
              boxShadow: "none",
              "&:hover": { bgcolor: "#274b30", boxShadow: "none" },
            }}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={allCategories}
        filters={filters}
        onApply={setFilters}
        container={phoneContainerRef?.current}
      />
    </Box>
  );
}
