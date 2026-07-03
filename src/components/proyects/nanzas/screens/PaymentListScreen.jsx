import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import AddPaymentModal from "./modals/AddPaymentModal.jsx";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { colors } from "../colors.js";

export default function PaymentListScreen({ payments, setPayments, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPayment, setMenuPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const TOTAL = payments.reduce((s, p) => s + p.amount, 0);

  const togglePaid = (id) =>
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, paid: !p.paid } : p)),
    );

  const handleAdd = (newPayment) => {
    setPayments((prev) => [...prev, newPayment]);
  };

  const paidAmount = payments
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.paid).length;
  const remaining = TOTAL - paidAmount;
  const progress = TOTAL > 0 ? (paidAmount / TOTAL) * 100 : 0;

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
      {/* HEADER */}
      <Box sx={{ mb: 0.25 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={onBack}
              sx={{ p: 0.25, color: colors.primary }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              sx={{ fontSize: 22, fontWeight: 500, color: colors.primary }}
            >
              Payment list
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: colors.bgGreen,
              borderRadius: 1,
              px: 1.5,
              py: 0.35,
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: colors.primary }}
            >
              July
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{ fontSize: 12, color: colors.textMuted, mt: 0.3, ml: 3.5 }}
        >
          {paidCount} of {payments.length} paid
        </Typography>
      </Box>

      {/* PROGRESS */}
      <Box sx={{ mt: 2, mb: 1.5 }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
        >
          <Typography
            sx={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}
          >
            Progress
          </Typography>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: colors.primary }}
          >
            ${paidAmount.toLocaleString()} / ${TOTAL.toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            height: 6,
            bgcolor: colors.bgGreen,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              bgcolor: colors.primary,
              borderRadius: 4,
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Box>

      {/* PAYMENT ROWS */}
      <Box sx={{ flex: 1, overflowY: "auto", mx: -2.5, px: 3 }}>
        {payments.map((payment) => (
          <Box key={payment.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1.1,
                gap: 0.25,
              }}
            >
              <Checkbox
                checked={payment.paid}
                onChange={() => togglePaid(payment.id)}
                size="small"
                sx={{
                  p: 0.25,
                  color: colors.border,
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                  "&.Mui-checked": { color: colors.primary },
                }}
              />
              <Box sx={{ flex: 1, ml: 0.75 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  {payment.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                  {payment.category}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  mr: 0.25,
                }}
              >
                ${payment.amount.toLocaleString()}
              </Typography>
              <IconButton
                size="small"
                sx={{ p: 0.25, color: colors.border }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAnchor(e.currentTarget);
                  setMenuPayment(payment);
                }}
              >
                <MoreVertIcon sx={{ fontSize: 19 }} />
              </IconButton>
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
                      bgcolor: "#ffffff",
                      backgroundImage: "none",
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setEditingPayment(menuPayment);
                    setModalOpen(true);
                    setMenuAnchor(null);
                  }}
                  sx={{ fontSize: 13, color: "#1a1a1a", gap: 1 }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setPayments((prev) =>
                      prev.filter((p) => p.id !== menuPayment.id),
                    );
                    setMenuAnchor(null);
                  }}
                  sx={{ fontSize: 13, color: "#d32f2f", gap: 1 }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Box>
            <Divider sx={{ height: "1px", bgcolor: colors.bgGreen, mx: 2 }} />
          </Box>
        ))}

        {/* REMAINING */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: colors.bgGreen,
            px: 2.5,
            py: 1.1,
          }}
        >
          <Typography
            sx={{ fontSize: 13, color: colors.primary, fontWeight: 500 }}
          >
            Remaining
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
            ${remaining.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* ADD PAYMENT BUTTON */}
      <Button
        onClick={() => {
          setEditingPayment(null);
          setModalOpen(true);
        }}
        sx={{
          width: "100%",
          mt: 2,
          bgcolor: colors.primary,
          border: "none",
          borderRadius: "14px",
          py: 1.35,
          textTransform: "none",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{ fontSize: 14, fontWeight: 600, color: colors.surface }}
        >
          Add Payment Item
        </Typography>
      </Button>
      <AddPaymentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPayment(null);
        }}
        onAdd={(data) => {
          if (editingPayment) {
            setPayments((prev) =>
              prev.map((p) =>
                p.id === editingPayment.id ? { ...data, id: p.id } : p,
              ),
            );
          } else {
            handleAdd(data);
          }
        }}
        initialData={editingPayment}
      />
    </Box>
  );
}
