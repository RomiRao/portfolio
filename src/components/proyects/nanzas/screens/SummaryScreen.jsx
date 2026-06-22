import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Button,
  Avatar,
} from "@mui/material";
import { ArrowBack, Category } from "@mui/icons-material";
import { jsPDF } from "jspdf";

const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

export default function SummaryScreen({ onChange }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();

  // 1. Obtener datos de localStorage
  const transactions = useMemo(() => {
    return JSON.parse(localStorage.getItem("nanzas_transactions") || "[]");
  }, []);

  const categories = useMemo(() => {
    return JSON.parse(localStorage.getItem("nanzas_categories") || "[]");
  }, []);

  // 2. Filtrar y procesar datos según el mes seleccionado
  const { filteredCategories, maxIncomeCat, maxExpenseCat, monthLabel } =
    useMemo(() => {
      const monthlyTx = transactions.filter((tx) => {
        if (!tx.date) return false;
        const txDate = new Date(tx.date + "T00:00:00");
        return (
          txDate.getMonth() === selectedMonth &&
          txDate.getFullYear() === currentYear
        );
      });

      const grouped = {};
      let maxInc = { amount: 0, catName: "None", color: "#999" };
      let maxExp = { amount: 0, catName: "None", color: "#999" };

      monthlyTx.forEach((tx) => {
        const catId = tx.categoryId?.toString() || "general";
        const catObj = categories.find((c) => c.id?.toString() === catId);
        const catName = catObj?.name || "General";
        const catColor = catObj?.color || "#7986cb";
        const catIcon = catObj?.icon || "";

        if (!grouped[catId]) {
          grouped[catId] = {
            id: catId,
            name: catName,
            color: catColor,
            icon: catIcon,
            total: 0,
          };
        }

        const amountNum = Number(tx.amount) || 0;

        if (tx.type === "income") {
          grouped[catId].total += amountNum;
          if (amountNum > maxInc.amount) {
            maxInc = { amount: amountNum, catName, color: catColor };
          }
        } else {
          grouped[catId].total -= amountNum;
          if (amountNum > maxExp.amount) {
            maxExp = { amount: amountNum, catName, color: catColor };
          }
        }
      });

      // CORRECCIÓN AQUÍ: Cambiado 'finalCategories' por 'filteredCategories'
      const filteredCategories = Object.values(grouped).sort(
        (a, b) => b.total - a.total // Ordenados de mayor a menor impacto
      );

      return {
        filteredCategories,
        maxIncomeCat: maxInc,
        maxExpenseCat: maxExp,
        monthLabel: MONTHS.find((m) => m.value === selectedMonth)?.label || "",
      };
    }, [selectedMonth, transactions, categories, currentYear]);

  // 3. Generación y descarga del reporte PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50); // ◄ CORREGIDO
    doc.text(`Financial Summary - ${monthLabel} ${currentYear}`, 20, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100); // ◄ CORREGIDO
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 33);
    doc.line(20, 36, 190, 36);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(34, 34, 34); // ◄ CORREGIDO
    doc.text("Highlights of the Month", 20, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `Category with more income: ${maxIncomeCat.catName} (+$${maxIncomeCat.amount})`,
      25,
      58
    );
    doc.text(
      `Category with more expenses: ${maxExpenseCat.catName} (-$${maxExpenseCat.amount})`,
      25,
      66
    );

    doc.line(20, 74, 190, 74);
    doc.setFont("helvetica", "bold");
    doc.text("Total per Category", 20, 84);

    let yPosition = 96;
    doc.setFont("helvetica", "normal");

    if (filteredCategories.length === 0) {
      doc.text("No transactions recorded in this period.", 25, yPosition);
    } else {
      filteredCategories.forEach((cat) => {
        const prefix = cat.total >= 0 ? "+" : "";
        doc.text(`${cat.name}`, 25, yPosition);
        doc.setFont("helvetica", "bold");
        doc.text(`${prefix}$${cat.total.toLocaleString()}`, 150, yPosition);
        doc.setFont("helvetica", "normal");
        yPosition += 8;
      });
    }

    doc.save(`Summary_${monthLabel}_${currentYear}.pdf`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1, // Cambiado de 100vh para que se ajuste perfectamente al mockup
        overflow: "hidden",
        bgcolor: "#f4f6f4",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 3,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => onChange("dashboard")}
            sx={{ color: "#2e7d32" }}
          >
            <ArrowBack fontSize="large" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2e7d32" }}>
            Summary
          </Typography>
        </Box>

        {/* Dropdown de Selección de Mes */}
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          variant="standard"
          disableUnderline
          sx={{
            bgcolor: "#e2ede2",
            borderRadius: "16px",
            px: 2,
            py: 0.5,
            fontSize: "14px",
            fontWeight: 600,
            color: "#2e7d32",
            "& .MuiSelect-select": { py: 0, pr: "24px !important" },
          }}
          // 👇 AGREGA ESTA PROPIEDAD AQUÍ ABAJO
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#ffffff", // Fuerza el fondo blanco sólido
                borderRadius: "12px", // Bordes suaves más estéticos
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)", // Sombra limpia para dar profundidad
                mt: 0.5, // Separa el menú un poquito del botón
                "& .MuiMenuItem-root": {
                  color: "#333333", // Asegura que las letras sean oscuras y legibles
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#e2ede2", // Color verde clarito al pasar el mouse
                  },
                  "&.Mui-selected": {
                    bgcolor: "#2e7d32", // Color verde principal si el mes está seleccionado
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#1b5e20" },
                  },
                },
              },
            },
          }}
        >
          {MONTHS.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* CUERPO PRINCIPAL */}
      <Box sx={{ flex: 1, px: 3, overflowY: "auto" }}>
        {/* HIGHLIGHTS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#555", fontSize: "15px" }}>
              Category with more income
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  bgcolor: "#2e7d32",
                  color: "#fff",
                  px: 1.5,
                  py: 0.3,
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {maxIncomeCat.catName}
              </Box>
              <Typography sx={{ fontWeight: 600, color: "#555" }}>
                + ${maxIncomeCat.amount}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#555", fontSize: "15px" }}>
              Category with more expenses
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  bgcolor: "#cddc39",
                  color: "#333",
                  px: 1.5,
                  py: 0.3,
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {maxExpenseCat.catName}
              </Box>
              <Typography sx={{ fontWeight: 600, color: "#777" }}>
                - ${maxExpenseCat.amount}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* LISTA DE TOTALES POR CATEGORÍA */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#777", mt: 4, mb: 2 }}
        >
          Total per category
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
          {filteredCategories.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "#999", my: 3 }}>
              No transactions data for this month.
            </Typography>
          ) : (
            filteredCategories.map((cat) => {
              const isExpense = cat.total < 0;
              return (
                <Box
                  key={cat.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: cat.color,
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                      }}
                    >
                      {cat.icon ? (
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          width={22}
                          height={22}
                        />
                      ) : (
                        <Category sx={{ color: "#fff" }} />
                      )}
                    </Avatar>
                    <Typography
                      sx={{ fontWeight: 600, color: "#222", fontSize: "16px" }}
                    >
                      {cat.name}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: isExpense ? "#777" : "#2e7d32",
                      fontSize: "16px",
                    }}
                  >
                    {isExpense ? "" : "+"}${cat.total.toLocaleString()}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>

        {/* BOTÓN DOWNLOAD */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 6 }}>
          <Button
            onClick={downloadPDF}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#2e7d32",
              color: "#fff",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 500,
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              "&:hover": { bgcolor: "#1b5e20" },
            }}
          >
            Download summary
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
