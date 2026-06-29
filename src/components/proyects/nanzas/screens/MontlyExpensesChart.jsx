import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../colors.js";

const EXPENSES_STORAGE_KEY = "nanzas_card_expenses";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SCROLL_INDICATOR_WIDTH_PCT = 40;

const EXPENSE_TYPES = {
  AUTO: "Automatic debit",
  INSTALLMENTS: "Installment payment",
  ONE_TIME: "Single payment",
};

/**
 * ---------------------------------------------------------------------------
 * DATA PROCESSING
 * ---------------------------------------------------------------------------
 * Lee y normaliza los gastos desde localStorage, y los distribuye mes a mes
 * teniendo en cuenta la lógica de cuotas (instalments).
 *
 * Estructura esperada de cada gasto en localStorage:
 * {
 *   id: string | number,
 *   cardId: string | number,
 *   amount: number,          // monto TOTAL de la compra (no de la cuota)
 *   date: "YYYY-MM-DD",      // fecha de la compra
 *   type: "auto" | "inst" | "one",
 *   installments: number,    // cantidad de cuotas (1 si es pago único / auto)
 * }
 */
function safeParseExpenses() {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Error parsing expenses from localStorage", e);
    return [];
  }
}

/**
 * Normaliza un registro de gasto crudo a un formato seguro de trabajar.
 * Devuelve null si el registro es inválido (fecha o monto corruptos).
 */
function normalizeExpense(raw) {
  if (!raw) return null;

  const amount = Number(raw.amount);
  if (Number.isNaN(amount) || amount <= 0) return null;

  const date = new Date(raw.date);
  if (Number.isNaN(date.getTime())) return null;

  const type = [
    EXPENSE_TYPES.AUTO,
    EXPENSE_TYPES.INSTALLMENTS,
    EXPENSE_TYPES.ONE_TIME,
  ].includes(raw.type)
    ? raw.type
    : EXPENSE_TYPES.ONE_TIME;

  let installments = Number(raw.installments);
  if (
    type !== EXPENSE_TYPES.INSTALLMENTS ||
    Number.isNaN(installments) ||
    installments < 1
  ) {
    installments = 1;
  }

  return {
    cardId: raw.cardId ?? null,
    amount,
    purchaseYear: date.getFullYear(),
    purchaseMonth: date.getMonth(), // 0-11
    type,
    installments,
  };
}

/**
 * Agrupa los gastos por mes del año indicado (por defecto el año actual),
 * distribuyendo el valor de las cuotas en los meses subsiguientes.
 *
 * Devuelve un array de 12 posiciones (una por mes), cada una con:
 * { auto, inst, one, total }
 */
function buildMonthlyBuckets(rawExpenses, targetYear, cardId = null) {
  // Inicializamos 12 buckets vacíos
  const buckets = Array.from({ length: 12 }, () => ({
    auto: 0,
    inst: 0,
    one: 0,
    total: 0,
  }));

  rawExpenses
    .map(normalizeExpense)
    .filter(Boolean)
    .filter((exp) => (cardId == null ? true : exp.cardId === cardId))
    .forEach((exp) => {
      if (exp.type === EXPENSE_TYPES.INSTALLMENTS) {
        const installmentAmount = exp.amount / exp.installments;

        // Distribuye 1 cuota en el mes de compra y en cada mes siguiente,
        // cruzando años si la cuota se extiende más allá de diciembre.
        for (let i = 0; i < exp.installments; i++) {
          const absoluteMonthIndex =
            exp.purchaseYear * 12 + exp.purchaseMonth + i;
          const year = Math.floor(absoluteMonthIndex / 12);
          const month = absoluteMonthIndex % 12;

          if (year === targetYear) {
            buckets[month].inst += installmentAmount;
            buckets[month].total += installmentAmount;
          }
        }
      } else {
        // Gasto único: débito automático o compra de un pago, sin distribución.
        if (exp.purchaseYear === targetYear) {
          if (exp.type === EXPENSE_TYPES.AUTO) {
            buckets[exp.purchaseMonth].auto += exp.amount;
          } else {
            buckets[exp.purchaseMonth].one += exp.amount;
          }
          buckets[exp.purchaseMonth].total += exp.amount;
        }
      }
    });

  // Redondeamos a 2 decimales para evitar artefactos de floating point.
  return buckets.map((b) => ({
    auto: Math.round(b.auto * 100) / 100,
    inst: Math.round(b.inst * 100) / 100,
    one: Math.round(b.one * 100) / 100,
    total: Math.round(b.total * 100) / 100,
  }));
}

function formatCurrency(value) {
  const rounded = Math.round(value);
  return `$${rounded.toLocaleString("en-US")}`;
}

/**
 * ---------------------------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------------------------
 */
export default function MonthlyExpensesChart({ cardId = null }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [scrollPct, setScrollPct] = useState(0); // 0 a 1, posición del scroll horizontal
  const scrollRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11

  useEffect(() => {
    const rawExpenses = safeParseExpenses();
    const buckets = buildMonthlyBuckets(rawExpenses, currentYear, cardId);
    setMonthlyData(buckets);
  }, [currentYear, cardId]);

  // Centra el scroll en el mes actual al montar, y calcula el % inicial.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      // Posiciona el scroll para que el mes actual quede visible/centrado.
      const approxMonthWidth = el.scrollWidth / 12;
      const targetScroll = Math.min(
        maxScroll,
        Math.max(
          0,
          approxMonthWidth * currentMonthIndex -
            el.clientWidth / 2 +
            approxMonthWidth / 2,
        ),
      );
      el.scrollLeft = targetScroll;
      setScrollPct(targetScroll / maxScroll);
    }
  }, [monthlyData, currentMonthIndex]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollPct(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  };

  const handleTrackPointerDown = (e) => {
    const track = trackRef.current;
    const scrollEl = scrollRef.current;
    if (!track || !scrollEl) return;

    const updateScroll = (clientX) => {
      const rect = track.getBoundingClientRect();
      // Calcula la posición del clic relativa al ancho de la barra (de 0 a 1)
      const clickX = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));

      // Mueve el scroll horizontal del gráfico según el porcentaje
      const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      scrollEl.scrollLeft = pct * maxScroll;
    };

    // Mueve al punto inicial del clic
    updateScroll(e.clientX);

    // Eventos para seguir moviendo mientras mantienes presionado
    const handlePointerMove = (moveEvent) => {
      updateScroll(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const MAX_BAR_HEIGHT = 110;
  const BAR_WIDTH = 26;

  return (
    <Box sx={{ width: "100%" }}>
      {/* --- CONTENEDOR CON SCROLL HORIZONTAL --- */}
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: "18px",
            minWidth: "max-content",
            height: MAX_BAR_HEIGHT + 50,
            px: 1,
            position: "relative",
          }}
        >
          {/* --- LÍNEA BASE DE LAS BARRAS --- */}
          {/* --- LÍNEAS GUÍA PUNTEADAS DETRÁS DE LAS BARRAS --- */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <Box
              key={fraction}
              sx={{
                position: "absolute",
                bottom: `${38 + fraction * MAX_BAR_HEIGHT}px`,
                left: 0,
                right: 0,
                height: 0,
                borderTop: `1px dashed ${colors.lightGray}`,
                zIndex: 0,
              }}
            />
          ))}
          <Box
            sx={{
              position: "absolute",
              bottom: "38px",
              left: 0,
              right: 0,
              height: "1px",
              bgcolor: colors.lightGray,
              zIndex: 0,
            }}
          />

          {MONTH_LABELS.map((label, index) => {
            const data = monthlyData[index] || {
              auto: 0,
              inst: 0,
              one: 0,
              total: 0,
            };
            const isSelected = index === currentMonthIndex;

            const autoPct = data.total > 0 ? (data.auto / data.total) * 100 : 0;
            const instPct = data.total > 0 ? (data.inst / data.total) * 100 : 0;
            const onePct = data.total > 0 ? (data.one / data.total) * 100 : 0;

            return (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  width: BAR_WIDTH + 14,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* --- BARRA --- */}
                <Box
                  sx={{
                    width: BAR_WIDTH,
                    height: MAX_BAR_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: BAR_WIDTH,
                      height: `100%`,

                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column-reverse",
                      bgcolor:
                        data.total === 0 ? colors.lightGray : "transparent",
                    }}
                  >
                    {/* Orden de abajo hacia arriba (column-reverse):
                        1) Auto (más oscuro, va abajo)
                        2) Installments
                        3) One-time (arriba) */}
                    <Box
                      sx={{
                        width: "100%",
                        height: `${autoPct}%`,
                        bgcolor: colors.darkGreen,
                      }}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        height: `${instPct}%`,
                        bgcolor: colors.primary,
                      }}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        height: `${onePct}%`,
                        bgcolor: colors.bgLightGreen,
                      }}
                    />
                  </Box>
                </Box>

                {/* --- LABEL DEL MES --- */}
                {isSelected ? (
                  <Box
                    sx={{
                      bgcolor: colors.primary,
                      color: colors.surface,
                      px: 1.1,
                      py: 0.15,
                      borderRadius: "10px",
                      mt: 0.6,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.4 }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: colors.black,
                      mt: 0.6,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </Typography>
                )}

                {/* --- TOTAL DEL MES --- */}
                <Typography
                  sx={{
                    fontSize: 10,
                    color: colors.black,
                    fontWeight: isSelected ? 700 : 500,
                    mt: 0.3,
                  }}
                >
                  {formatCurrency(data.total)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* --- INDICADOR DE POSICIÓN DE SCROLL --- */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Box
          ref={trackRef} // <-- A) Agregamos la referencia
          onPointerDown={handleTrackPointerDown}
          sx={{
            width: "20%",
            height: 3,
            bgcolor: colors.lightGray,
            borderRadius: 2,
            mt: 1,
            mb: 0.5,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: `${scrollPct * (100 - SCROLL_INDICATOR_WIDTH_PCT)}%`,
              width: `${SCROLL_INDICATOR_WIDTH_PCT}%`,
              height: "100%",
              bgcolor: colors.primary,
              borderRadius: 2,
              transition: "left 0.1s linear",
            }}
          />
        </Box>
      </Box>

      {/* --- LEYENDA --- */}
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          px: 1,

          gap: 1,
        }}
      >
        <LegendItem color={colors.darkGreen} label="Automatic debits" />
        <LegendItem color={colors.primary} label="Installments purchases" />
        <LegendItem color={colors.bgLightGreen} label="One-time purchase" />
      </Box>
    </Box>
  );
}

function LegendItem({ color, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
      <Box
        sx={{ width: 16, height: 12, borderRadius: "100%", bgcolor: color }}
      />
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,
          color: "#2a2a2a",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
