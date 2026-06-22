import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { MoreVert, Add } from "@mui/icons-material";
import { colors } from "../../nanzas/colors";
import NewCategoryModal, { STORAGE_KEY } from "./modals/AddCategoryModal";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import houseIcon from "../../../../assets/icons/house-icon.svg";
import transactionIcon from "../../../../assets/icons/transaction-icon.svg";
import petIcon from "../../../../assets/icons/pet-icon.svg";

const TRANSACTIONS_STORAGE_KEY = "nanzas_transactions";

function isCategoryInUse(categoryId) {
  if (!categoryId) return false;
  const transactions = JSON.parse(
    localStorage.getItem(TRANSACTIONS_STORAGE_KEY) || "[]"
  );
  return transactions.some((t) => String(t.categoryId) === String(categoryId));
}

export default function CategoriesScreen() {
  const [tab, setTab] = useState("expense");
  const DEFAULT_CATEGORIES = [
    {
      id: 1781738044692,
      name: "Rent",
      icon: houseIcon,
      iconName: "home-icon",
      color: "#14b8a6",
      type: "expense",
    },
    {
      id: 1781738044694,
      name: "Salary",
      icon: transactionIcon,
      iconName: "transaction-icon",
      color: "#14b8a6",
      type: "income",
    },
  ];
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
  });

  console.log("categorias", categories);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuCat, setMenuCat] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const filtered = categories.filter((c) => c.type === tab);

  const handleSave = () => {
    const updated = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setCategories(updated);
    setShowModal(false);
    setEditingCat(null);
  };

  const getDeleteBlockReason = (cat) => {
    if (!cat) return null;

    const sameTypeCount = categories.filter((c) => c.type === cat.type).length;
    if (sameTypeCount <= 1) {
      return "You can't delete the last category.";
    }

    if (isCategoryInUse(cat.id)) {
      return "You can't delete categories with transactions saved.";
    }

    return null;
  };

  const handleDelete = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;

    const blockReason = getDeleteBlockReason(cat);
    if (blockReason) {
      setSnackbarMsg(blockReason);
      setMenuAnchor(null);
      return;
    }

    const updated = categories.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCategories(updated);
    setMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "#fff",
        px: 2,
        pt: 1.5,
        pb: 2,
        position: "relative",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          position: "relative",
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 700, color: colors.primary }}
        >
          Categories
        </Typography>
        <IconButton
          onClick={() => setShowModal(true)}
          sx={{
            position: "absolute",
            right: 0,
            border: "1.5px solid #c8d9b0",
            borderRadius: "50%",
            p: 0.4,
          }}
        >
          <Add sx={{ fontSize: 18, color: colors.primary }} />
        </IconButton>
      </Box>

      {/* Tabs */}
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
              textAlign: "center",
              py: "9px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              bgcolor: tab === t ? colors.primary : "transparent",
              color: tab === t ? "#fff" : "#3a5a1c",
            }}
          >
            {t === "expense" ? "↓ Expense" : "↑ Income"}
          </Box>
        ))}
      </Box>

      {/* List */}
      {filtered.length === 0 ? (
        <Typography
          sx={{ fontSize: 13, color: "#aaa", textAlign: "center", mt: 4 }}
        >
          No categories yet
        </Typography>
      ) : (
        filtered.map((cat, i) => (
          <React.Fragment key={cat.id}>
            {i > 0 && <Divider />}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2 }}
            >
              <Avatar
                sx={{
                  bgcolor: cat.color,
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                }}
              >
                <img
                  src={cat.icon}
                  width="20"
                  height="20"
                  style={{ filter: "brightness(0) invert(1)" }}
                  alt={cat.iconName}
                />
              </Avatar>
              <Typography
                sx={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#111" }}
              >
                {cat.name}
              </Typography>
              <IconButton
                size="small"
                sx={{ p: 0.25, color: colors.border }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAnchor(e.currentTarget);
                  setMenuCat(cat);
                }}
              >
                <MoreVertIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Box>
          </React.Fragment>
        ))
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
            setEditingCat(menuCat);
            setShowModal(true);
            setMenuAnchor(null);
          }}
          sx={{ fontSize: 13, color: "#1a1a1a", gap: 1 }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(menuCat?.id)}
          disabled={
            getDeleteBlockReason(menuCat) ===
            "You can't delete the last category."
          }
          sx={{ fontSize: 13, color: colors.error, gap: 1 }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Modal */}
      {showModal && (
        <NewCategoryModal
          onClose={() => {
            setShowModal(false);
            setEditingCat(null);
          }}
          onSave={handleSave}
          initialData={editingCat}
        />
      )}
      <Snackbar
        open={Boolean(snackbarMsg)}
        autoHideDuration={2500}
        onClose={() => setSnackbarMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          position: "absolute",
          bottom: 20,
          width: "calc(100% - 32px)",
          zIndex: 1400,
        }}
      >
        <Alert
          severity="info"
          onClose={() => setSnackbarMsg("")}
          sx={{
            width: "100%",
            fontSize: 13,
            fontWeight: 500,
            bgcolor: colors.primary,
            color: colors.surface,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            "& .MuiAlert-icon": { color: colors.surface },
            "& .MuiAlert-action": { color: colors.surface },
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
