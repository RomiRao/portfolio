import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
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
  ChevronLeft,
  MoreVert,
} from "@mui/icons-material";
import { colors } from "../colors";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import TransactionItem from "./TransactionItem";

import transactionIcon from "../../../../assets/icons/transaction-icon.svg";
import cardIcon from "../../../../assets/icons/card-icon.svg";

const DEFAULT_COLOR = "#2e7d32";

function CategoryIcon() {
  return <img src={transactionIcon} alt="transaction" width={20} height={20} />;
}

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

const DEFAULT_TRANSACTIONS = [
  {
    id: 1782144837492,
    description: "Salary",
    amount: 2000,
    type: "income",
    categoryId: "1781738044694",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: 1782144826849,
    description: "Rent",
    amount: 4200,
    type: "expense",
    categoryId: "1781738044692",
    date: new Date().toISOString().split("T")[0],
  },
];

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

// ─── HOOK: CALCULAR SEGMENTOS DEL PERÍODO ────────────────────────────────────
function useChartData(period, transactions, refDate, customStart, customEnd) {
  return React.useMemo(() => {
    const allCats = JSON.parse(
      localStorage.getItem("nanzas_categories") || "[]",
    );

    const filtered = transactions.filter((tx) => {
      if (!tx.date) return true;

      const txDate = new Date(tx.date + "T00:00:00");
      const target = new Date(refDate);
      target.setHours(0, 0, 0, 0);

      if (period === "Day") {
        return txDate.toDateString() === target.toDateString();
      }
      if (period === "Week") {
        const start = new Date(target);
        start.setDate(start.getDate() - start.getDay()); // Domingo
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Sábado
        return txDate >= start && txDate <= end;
      }
      if (period === "Month") {
        return (
          txDate.getMonth() === target.getMonth() &&
          txDate.getFullYear() === target.getFullYear()
        );
      }
      if (period === "Year") {
        return txDate.getFullYear() === target.getFullYear();
      }
      if (period === "Period") {
        if (!customStart || !customEnd) return true;
        const s = new Date(customStart + "T00:00:00");
        const e = new Date(customEnd + "T23:59:59");
        return txDate >= s && txDate <= e;
      }
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
      hasData: filtered.length > 0,
    };
  }, [period, transactions, refDate, customStart, customEnd]);
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
            strokeDasharray={
              seg.isFull ? undefined : `${seg.arcLen} ${seg.gap}`
            }
            strokeDashoffset={seg.isFull ? undefined : seg.offset}
            transform="rotate(-90 68 68)"
          />
        ))}
      </svg>

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

export default function DashboardScreen({
  onChange,
  payments = [],
  phoneContainerRef,
}) {
  // Creamos la referencia que apuntará al contenedor "mockup" del dashboard
  const containerRef = React.useRef(null);

  const [period, setPeriod] = useState("Month");

  // Estados de control de Fechas dinámicas
  const [refDate, setRefDate] = useState(new Date());
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false); // Modal general unificado

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTx, setMenuTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem("nanzas_transactions");
    if (savedData !== null) return JSON.parse(savedData);
    localStorage.setItem(
      "nanzas_transactions",
      JSON.stringify(DEFAULT_TRANSACTIONS),
    );
    return DEFAULT_TRANSACTIONS;
  });

  const { segments, spending, income, hasData } = useChartData(
    period,
    transactions,
    refDate,
    customStart,
    customEnd,
  );

  // Navegación secuencial por flechas (Día, Semana, Mes, Año)
  const handlePrev = () => {
    const d = new Date(refDate);
    if (period === "Month") d.setMonth(d.getMonth() - 1);
    else if (period === "Week") d.setDate(d.getDate() - 7);
    else if (period === "Day") d.setDate(d.getDate() - 1);
    else if (period === "Year") d.setFullYear(d.getFullYear() - 1);
    setRefDate(d);
  };

  const handleNext = () => {
    const d = new Date(refDate);
    if (period === "Month") d.setMonth(d.getMonth() + 1);
    else if (period === "Week") d.setDate(d.getDate() + 7);
    else if (period === "Day") d.setDate(d.getDate() + 1);
    else if (period === "Year") d.setFullYear(d.getFullYear() + 1);
    setRefDate(d);
  };

  // Genera el texto legible en la barra superior
  const getPeriodLabel = () => {
    if (period === "Month") {
      return refDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    if (period === "Year") {
      return refDate.getFullYear().toString();
    }
    if (period === "Day") {
      return refDate.toLocaleDateString();
    }
    if (period === "Week") {
      const start = new Date(refDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    if (period === "Period") {
      if (customStart && customEnd) return `${customStart} to ${customEnd}`;
      return "Select custom period";
    }
    return "";
  };

  // Reinicia las fechas al cambiar entre pestañas principales
  React.useEffect(() => {
    if (period !== "Period") {
      setRefDate(new Date());
    } else if (!customStart && !customEnd) {
      setOpenDatePicker(true); // Abre directo si no hay rango fijado
    }
  }, [period]);

  const totalBalance = transactions.reduce((acc, tx) => {
    const amount = Number(tx.amount) || 0;
    return tx.type === "income" ? acc + amount : acc - amount;
  }, 0);

  const lastTransactions = transactions.slice(0, 5);
  const allCategories = JSON.parse(
    localStorage.getItem("nanzas_categories") || "[]",
  );

  const TOTAL = payments.reduce((s, p) => s + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.paid).length;
  const remaining = TOTAL - paidAmount;
  const progress = TOTAL > 0 ? (paidAmount / TOTAL) * 100 : 0;

  const handleDelete = (id) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    localStorage.setItem("nanzas_transactions", JSON.stringify(updated));
    setTransactions(updated);
    setMenuAnchor(null);
  };

  // RENDERIZADO DINÁMICO DE INPUTS DENTRO DEL MODAL
  const renderPickerInput = () => {
    if (period === "Month") {
      const currentMonthStr = `${refDate.getFullYear()}-${String(
        refDate.getMonth() + 1,
      ).padStart(2, "0")}`;
      return (
        <TextField
          type="month"
          label="Choose Month"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={currentMonthStr}
          onChange={(e) => {
            if (e.target.value) {
              const [y, m] = e.target.value.split("-");
              const d = new Date(refDate);
              d.setFullYear(parseInt(y), parseInt(m) - 1);
              setRefDate(d);
            }
          }}
        />
      );
    }
    if (period === "Day" || period === "Week") {
      return (
        <TextField
          type="date"
          label={period === "Day" ? "Choose Day" : "Choose Day within Week"}
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={refDate.toISOString().split("T")[0]}
          onChange={(e) => {
            if (e.target.value) {
              setRefDate(new Date(e.target.value + "T00:00:00"));
            }
          }}
        />
      );
    }
    if (period === "Year") {
      return (
        <TextField
          type="number"
          label="Choose Year"
          fullWidth
          value={refDate.getFullYear()}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val) {
              const d = new Date(refDate);
              d.setFullYear(val);
              setRefDate(d);
            }
          }}
        />
      );
    }
    if (period === "Period") {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            type="date"
            label="Start Date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <TextField
            type="date"
            label="End Date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: colors.bgGreen,
        px: 2,
        pt: 1.5,
        pb: 1,

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
          ${totalBalance.toLocaleString()}
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
        <Box sx={{ display: "flex", gap: 0.4, mb: 1.5, flexWrap: "wrap" }}>
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

        {/* Date row unificado e interactivo mediante Calendario */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
            {period !== "Period" && (
              <IconButton size="small" onClick={handlePrev} sx={{ p: 0.2 }}>
                <ChevronLeft sx={{ fontSize: 18, color: "#666" }} />
              </IconButton>
            )}

            {/* Toda esta zona (Texto + Icono) ahora abre el modal correspondiente */}
            <Box
              onClick={() => setOpenDatePicker(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                cursor: "pointer",
                px: 0.5,
                borderRadius: "6px",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#222" }}>
                {getPeriodLabel()}
              </Typography>
              <CalendarToday sx={{ fontSize: 15, color: "#2e7d32" }} />
            </Box>

            {period !== "Period" && (
              <IconButton size="small" onClick={handleNext} sx={{ p: 0.2 }}>
                <ChevronRight sx={{ fontSize: 18, color: "#666" }} />
              </IconButton>
            )}
          </Box>

          <Chip
            icon={<BarChart sx={{ fontSize: 15, color: "#fff !important" }} />}
            label="Summary"
            onClick={() => onChange("summary")} // <── Agregamos esto para navegar
            sx={{
              bgcolor: "#2e7d32",
              color: "#fff",
              fontWeight: 600,
              fontSize: 11,
              height: 28,
              cursor: "pointer",
              "& .MuiChip-label": { pl: 0.3 },
              "&:hover": { bgcolor: "#1b5e20" },
            }}
          />
        </Box>

        {/* Donut + legend */}
        {hasData ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            </Box>
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

      {/* Botones de acción rápido */}
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

      {/* Listado de Pagos */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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

      {/* Ultimas transacciones */}
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
            justifyValues: "space-between",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            Last transactions
          </Typography>
          <Typography
            onClick={() => onChange("history")} // ← Cambia a la pantalla de historial
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
              (c) => c.id.toString() === tx.categoryId?.toString(),
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
      </Box>

      {/* ── MODAL DINÁMICO SELECTOR DE FECHAS SEGÚN EL PERÍODO ACTIVO ── */}
      <Dialog
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        container={() => phoneContainerRef.current}
        sx={{ position: "absolute" }}
        slotProps={{
          backdrop: {
            sx: { position: "absolute" },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            bgcolor: "#ffffff",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#111" }}
        >
          Select Filter ({period})
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 260 }}>
          <Box sx={{ colorScheme: "light", pt: 1 }}>{renderPickerInput()}</Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button
            onClick={() => setOpenDatePicker(false)}
            variant="contained"
            sx={{
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
