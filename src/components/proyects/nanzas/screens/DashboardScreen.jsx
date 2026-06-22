import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Avatar,
  SvgIcon,
} from "@mui/material";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import {
  CalendarToday,
  BarChart,
  ChevronRight,
  MoreVert,
  Storefront,
  LocalGasStation,
  Redeem,
} from "@mui/icons-material";
import { colors } from "../colors";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";

import transactionIcon from "../../../../assets/icons/transaction-icon.svg";
import cardIcon from "../../../../assets/icons/card-icon.svg";

const DEFAULT_COLOR = "#2e7d32";

function CategoryIcon() {
  return <img src={transactionIcon} alt="transaction" width={20} height={20} />;
}

// ─── PALETTE DE COLORES PARA CATEGORÍAS SIN COLOR ASIGNADO ───────────────────
const AUTO_COLORS = [
  "#4caf50",
  "#29b6f6",
  "#ab47bc",
  "#cddc39",
  "#7986cb",
  "#ff7043",
  "#26c6da",
  "#ffca28",
];

// ─── LEGEND ITEM ──────────────────────────────────────────────────────────────
function LegendItem({ color, label, pct }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography sx={{ fontSize: 12, color: "#222", flex: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#888" }}>{pct}%</Typography>
    </Box>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyChart() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        gap: 1,
      }}
    >
      <Typography sx={{ fontSize: 32 }}>📊</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#555" }}>
        No transactions found.
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "#aaa", textAlign: "center", maxWidth: 200 }}
      >
        Add new transaction to reflect it here.
      </Typography>
    </Box>
  );
}

// ─── HOOK: calcular segmentos del período ────────────────────────────────────
function useChartData(period, transactions) {
  return React.useMemo(() => {
    const allCats = JSON.parse(
      localStorage.getItem("nanzas_categories") || "[]"
    );
    const now = new Date();

    const filtered = transactions.filter((tx) => {
      if (!tx.date) return true;

      const txDate = new Date(tx.date + "T00:00:00");

      if (period === "Day") return txDate.toDateString() === now.toDateString();
      if (period === "Week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (period === "Month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === "Year") return txDate.getFullYear() === now.getFullYear();
      return true;
    });

    const expenses = filtered.filter((tx) => tx.type === "expense");
    const totalSpending = expenses.reduce((s, tx) => s + Number(tx.amount), 0);
    const totalIncome = filtered
      .filter((tx) => tx.type === "income")
      .reduce((s, tx) => s + Number(tx.amount), 0);

    const grouped = {};
    expenses.forEach((tx) => {
      const key = tx.categoryId?.toString() || "general";
      grouped[key] = (grouped[key] || 0) + Number(tx.amount);
    });

    const segments = Object.entries(grouped)
      .map(([catId, amount], i) => {
        const cat = allCats.find((c) => c.id?.toString() === catId);
        const pct = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
        return {
          label: cat?.name || "General",
          color: cat?.color || AUTO_COLORS[i % AUTO_COLORS.length],
          amount,
          pct: Math.round(pct),
          pctDisplay: pct > 0 && pct < 1 ? "<1" : String(Math.round(pct)),
        };
      })
      .filter((seg) => seg.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return {
      segments,
      spending: totalSpending,
      income: totalIncome,
      hasData: transactions.length > 0,
    };
  }, [period, transactions]);
}
const isColorDark = (hex) => {
  // Eliminar el '#' si existe
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.7;
};

// ─── TRANSACTION ROW ──────────────────────────────────────────────────────────
function TransactionItem({ icon, iconBg, title, sub, amount, onMenuClick }) {
  const isDark = isColorDark(iconBg);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8 }}>
      <Avatar
        sx={{
          bgcolor: iconBg,
          width: 38,
          height: 38,
          borderRadius: "10px",
        }}
      >
        {/* Aplicamos el filtro al contenedor del icono */}
        <Box
          sx={{
            filter: isDark ? "brightness(0) invert(1)" : "none",
            transition: "filter 0.2s ease",
          }}
        >
          {icon}
        </Box>
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#999" }}>{sub}</Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: amount.includes("-") ? "#c62828" : "#2e7d32",
        }}
      >
        {amount}
      </Typography>

      <IconButton size="small" sx={{ p: 0.3 }} onClick={onMenuClick}>
        <MoreVert sx={{ fontSize: 17, color: "#bbb" }} />
      </IconButton>
    </Box>
  );
}

function DonutChart({ segments, spending, income }) {
  const cx = 68,
    cy = 68,
    r = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * r;

  const total = segments.reduce((s, x) => s + x.amount, 0);

  let cumPct = 0;
  const arcs = [...segments]
    .sort((a, b) => b.amount - a.amount)
    .map((seg) => {
      const pct = total > 0 ? seg.amount / total : 0;
      const arcLen = pct * circumference;

      const gap = circumference - arcLen;

      const offset = circumference - cumPct * circumference;

      cumPct += pct;

      return { ...seg, arcLen, gap, offset, isFull: pct === 1 };
    });

  return (
    <Box sx={{ position: "relative", width: 136, height: 136, flexShrink: 0 }}>
      <svg width={136} height={136} viewBox="0 0 136 136">
        {/* Track gris de fondo */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
        />
        {arcs.map((seg) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            // Declaramos la longitud del trazo y la longitud del vacío
            strokeDasharray={
              seg.isFull ? undefined : `${seg.arcLen} ${seg.gap}`
            }
            // Aplicamos el desfase
            strokeDashoffset={seg.isFull ? undefined : seg.offset}
            // Rotamos todos los círculos uniformemente para que empiecen arriba al centro
            transform="rotate(-90 68 68)"
          />
        ))}
      </svg>

      {/* Texto central */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "#888" }}>Spending</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#c62828" }}>
          {spending > 0 ? `-$${spending.toLocaleString()}` : "$0"}
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#888" }}>Income</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>
          {income > 0 ? `+$${income.toLocaleString()}` : "$0"}
        </Typography>
      </Box>
    </Box>
  );
}
// ─── DASHBOARD SCREEN ─────────────────────────────────────────────────────────
const PERIODS = ["Month", "Week", "Day", "Year", "Period"];

export default function DashboardScreen({ onChange, payments }) {
  const [period, setPeriod] = useState("Month");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTx, setMenuTx] = useState(null);
  const [transactions, setTransactions] = useState(() =>
    JSON.parse(localStorage.getItem("nanzas_transactions") || "[]")
  );
  const { segments, spending, income, hasData } = useChartData(
    period,
    transactions
  );

  const lastTransactions = JSON.parse(
    localStorage.getItem("nanzas_transactions") || "[]"
  ).slice(0, 5);

  const allCategories = JSON.parse(
    localStorage.getItem("nanzas_categories") || "[]"
  );

  const TOTAL = payments.reduce((s, p) => s + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.paid).length;
  const remaining = TOTAL - paidAmount;
  const progress = TOTAL > 0 ? (paidAmount / TOTAL) * 100 : 0;

  //funciones de transacciones
  const handleDelete = (id) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    localStorage.setItem("nanzas_transactions", JSON.stringify(updated));
    setTransactions(updated);
    setMenuAnchor(null);
  };

  const handleEditSave = () => {
    const updated = transactions.map((tx) =>
      tx.id === editingTx.id
        ? { ...tx, ...editingTx, amount: Number(editingTx.amount) }
        : tx
    );
    localStorage.setItem("nanzas_transactions", JSON.stringify(updated));
    setTransactions(updated);
    setShowModal(false);
  };

  const data = segments.map((seg) => ({
    title: seg.label,
    value: seg.amount,
    color: seg.color,
  }));

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: colors.bgGreen,
        px: 2,
        pt: 1.5,
        pb: 1,
        // Hide scrollbar visually
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* ── Balance ── */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#2e7d32" }}>
          Balance
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
          $5465
        </Typography>
      </Box>

      {/* ── Chart card ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          p: 1.8,
          mb: 1.8,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Period tabs */}
        <Box sx={{ display: "flex", gap: 0.4, mb: 1.5 }}>
          {PERIODS.map((p) => (
            <Chip
              key={p}
              label={p}
              onClick={() => setPeriod(p)}
              size="small"
              sx={{
                fontSize: 11,
                height: 26,
                bgcolor: period === p ? "#1a1a1a" : "transparent",
                color: period === p ? "#fff" : "#888",
                border: period === p ? "none" : "1px solid #e0e0e0",
                fontWeight: period === p ? 700 : 400,
                cursor: "pointer",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          ))}
        </Box>

        {/* Date row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#222" }}>
              July - 2026
            </Typography>
            <CalendarToday sx={{ fontSize: 14, color: "#999" }} />
          </Box>
          <Chip
            icon={<BarChart sx={{ fontSize: 15, color: "#fff !important" }} />}
            label="Summary"
            sx={{
              bgcolor: "#2e7d32",
              color: "#fff",
              fontWeight: 600,
              fontSize: 11,
              height: 28,
              "& .MuiChip-label": { pl: 0.3 },
            }}
          />
        </Box>

        {/* Donut + legend */}
        {hasData ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Donut con texto central */}
            <Box
              sx={{
                position: "relative",
                width: 136,
                height: 136,
                flexShrink: 0,
              }}
            >
              <DonutChart
                segments={segments}
                spending={spending}
                income={income}
              />
              {/* Texto superpuesto en el hueco del donut */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography sx={{ fontSize: 10, color: "#888" }}>
                  Spending
                </Typography>
                <Typography
                  sx={{ fontSize: 11, fontWeight: 700, color: "#c62828" }}
                >
                  {spending > 0 ? `-$${spending.toLocaleString()}` : "$0"}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#888" }}>
                  Income
                </Typography>
                <Typography
                  sx={{ fontSize: 11, fontWeight: 700, color: "#2e7d32" }}
                >
                  {income > 0 ? `+$${income.toLocaleString()}` : "$0"}
                </Typography>
              </Box>
            </Box>

            {/* Leyenda */}
            <Box sx={{ flex: 1 }}>
              {segments.map((seg) => (
                <LegendItem
                  key={seg.label}
                  color={seg.color}
                  label={seg.label}
                  pct={seg.pctDisplay ?? seg.pct}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <EmptyChart />
        )}
      </Box>

      <Box sx={{ display: "flex", width: "100%", gap: 2, mb: 1.8 }}>
        <Box
          onClick={() => onChange("newtransaction")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            bgcolor: "#fff",
            borderRadius: 3,
            py: 1,
            px: 2,
            gap: 1,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            width: "100%",
          }}
        >
          <img src={transactionIcon} alt="transaction" width={24} height={24} />
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: colors.primary, fontSize: "12px" }}
          >
            New Transaction
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",

            bgcolor: "#fff",
            borderRadius: 3,
            py: 1,
            px: 1,
            gap: 1,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            width: "100%",
          }}
        >
          <img src={cardIcon} alt="transaction" width={24} height={24} />
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: colors.primary, fontSize: "12px" }}
          >
            New Card Expense
          </Typography>
        </Box>
      </Box>

      {/* ── Payment list card ── */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.2,
          bgcolor: "#fff",
          borderRadius: 3,
          p: 1.8,
          mb: 1.8,
          gap: 2,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ flex: "1" }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            Payment list
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 3,
              mb: 0.8,
              bgcolor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#2e7d32",
                borderRadius: 3,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: 11,
              color: paidCount === payments.length ? "#2e7d32" : "#999",
              fontWeight: paidCount === payments.length ? 600 : 400,
            }}
          >
            {paidCount === payments.length
              ? "All payments have been done ✓"
              : `${paidCount} of ${
                  payments.length
                } - $${remaining.toLocaleString()} remaining`}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => onChange("paymentlist")}
          sx={{
            bgcolor: "#2e7d32",
            color: "#fff",
            width: 32,
            height: 32,
            "&:hover": { bgcolor: "#1b5e20" },
          }}
        >
          <ChevronRight sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Last transactions card ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          p: 1.8,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            Last transactions
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "#2e7d32",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            More
          </Typography>
        </Box>

        {lastTransactions.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", margin: "20px 0" }}>
            No transactions added.
          </p>
        ) : (
          lastTransactions.map((tx) => {
            const cat = allCategories.find(
              (c) => c.id.toString() === tx.categoryId?.toString()
            );
            return (
              <TransactionItem
                key={tx.id}
                icon={
                  cat ? (
                    <img src={cat.icon} alt={cat.name} width={20} height={20} />
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
                  setMenuAnchor(e.currentTarget); // Establece dónde aparece el menú
                  setMenuTx(tx); // Guarda qué transacción se tocó
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
            onClick={() => {
              handleDelete(menuTx?.id);
              setMenuAnchor(null);
            }}
            sx={{ color: colors.error }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
