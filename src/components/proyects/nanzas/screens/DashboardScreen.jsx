import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Avatar,
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

// ─── DONUT CHART SVG ──────────────────────────────────────────────────────────
function DonutChart() {
  const segments = [
    { pct: 30, color: "#4caf50" }, // Food
    { pct: 20, color: "#29b6f6" }, // Car
    { pct: 20, color: "#ab47bc" }, // Pets
    { pct: 20, color: "#cddc39" }, // Cloth
    { pct: 10, color: "#7986cb" }, // Gifts
  ];
  const r = 52;
  const cx = 68;
  const cy = 68;
  const circumference = 2 * Math.PI * r;
  const gap = 3;

  let cumulativePct = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circumference - gap;
    const offset = -(cumulativePct / 100) * circumference;
    cumulativePct += seg.pct;
    return (
      <circle
        key={seg.color}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={13}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    );
  });

  return (
    <svg width={136} height={136} viewBox="0 0 136 136">
      {arcs}
      <text
        x={cx}
        y={cy - 11}
        textAnchor="middle"
        fontSize={10.5}
        fill="#888"
        fontFamily="sans-serif"
      >
        Spending
      </text>
      <text
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fontSize={12}
        fill="#c62828"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        -$2000
      </text>
      <text
        x={cx}
        y={cy + 17}
        textAnchor="middle"
        fontSize={10.5}
        fill="#888"
        fontFamily="sans-serif"
      >
        Income
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fontSize={12}
        fill="#2e7d32"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        +$2000
      </text>
    </svg>
  );
}

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

// ─── TRANSACTION ROW ──────────────────────────────────────────────────────────
function TransactionItem({ icon, iconBg, title, sub, amount }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8 }}>
      <Avatar
        sx={{ bgcolor: iconBg, width: 38, height: 38, borderRadius: "10px" }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#999" }}>{sub}</Typography>
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#c62828" }}>
        {amount}
      </Typography>
      <IconButton size="small" sx={{ p: 0.3 }}>
        <MoreVert sx={{ fontSize: 17, color: "#bbb" }} />
      </IconButton>
    </Box>
  );
}

// ─── DASHBOARD SCREEN ─────────────────────────────────────────────────────────
const PERIODS = ["Month", "Week", "Day", "Year", "Period"];

export default function DashboardScreen({ onChange, payments }) {
  const [period, setPeriod] = useState("Month");

  const TOTAL = payments.reduce((s, p) => s + p.amount, 0);
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <DonutChart />
          <Box sx={{ flex: 1 }}>
            <LegendItem color="#4caf50" label="Food" pct={30} />
            <LegendItem color="#29b6f6" label="Car" pct={20} />
            <LegendItem color="#ab47bc" label="Pets" pct={20} />
            <LegendItem color="#cddc39" label="Cloth" pct={20} />
            <LegendItem color="#7986cb" label="Gifts" pct={10} />
          </Box>
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

        <TransactionItem
          icon={<Storefront sx={{ color: "#fff", fontSize: 19 }} />}
          iconBg="#4caf50"
          title="Market"
          sub="Food · 03/02/2026"
          amount="- $500"
        />
        <Divider />
        <TransactionItem
          icon={<LocalGasStation sx={{ color: "#fff", fontSize: 19 }} />}
          iconBg="#29b6f6"
          title="Gas Station"
          sub="Car · 03/02/2026"
          amount="- $120"
        />
        <Divider />
        <TransactionItem
          icon={<Redeem sx={{ color: "#fff", fontSize: 19 }} />}
          iconBg="#7986cb"
          title="Gift Shop"
          sub="Gifts · 03/02/2026"
          amount="- $85"
        />
      </Box>
    </Box>
  );
}
