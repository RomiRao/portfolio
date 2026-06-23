import React from "react";
import { Box, Typography, Button, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function CardsScreen({ onBack }) {
  const chartData = [
    { month: "Jan", values: { auto: 20, inst: 70, one: 10 }, total: "$100" },
    { month: "Feb", values: { auto: 15, inst: 65, one: 10 }, total: "$90" },
    { month: "Mar", values: { auto: 20, inst: 50, one: 15 }, total: "$50" },
    { month: "Apr", values: { auto: 10, inst: 80, one: 5 }, total: "$450" },
    { month: "May", values: { auto: 25, inst: 50, one: 15 }, total: "$15" },
    { month: "Jun", values: { auto: 15, inst: 65, one: 10 }, total: "$20" },
  ];

  const userCards = [
    {
      id: 1,
      type: "AMEX",
      bank: "Bank",
      number: "5084",
      cutoff: "07/3",
      expire: "30/2",
      balance: "$345",
      theme: "dark",
    },
    {
      id: 2,
      type: "AMEX",
      bank: "Bank",
      number: "5084",
      cutoff: "07/3",
      expire: "30/2",
      balance: "$345",
      theme: "light",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%", // Asegura que el contenedor ocupe el alto disponible
        bgcolor: "#f4f6f4",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        display: "flex",
        flexDirection: "column",
        px: 2.5,
        pt: 2,
        overflow: "hidden", // Evita que la pantalla completa rebote o rompa el layout
      }}
    >
      {/* --- HEADER (Fijo en la parte superior) --- */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onBack} sx={{ p: 0, color: "#1b4d22", mr: 1 }}>
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1b4d22" }}>
          My cards
        </Typography>
      </Box>

      {/* --- CONTENEDOR SCROLEABLE (Desde Balance hasta las Tarjetas) --- */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto", // Habilita el scroll vertical general aquí
          pb: 4,
          "&::-webkit-scrollbar": { display: "none" }, // Oculta la barra nativa
        }}
      >
        {/* --- BALANCE GENERAL --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 12, color: "#555", fontWeight: 500 }}>
              Total credit card balance
            </Typography>
            <Typography
              sx={{ fontSize: 28, fontWeight: 800, color: "#000", mt: -0.5 }}
            >
              $500
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#d2e7d6",
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{ fontSize: 12, fontWeight: 600, color: "#1b4d22" }}
            >
              All cards
            </Typography>
            <ArrowDropDownIcon
              sx={{ fontSize: 18, color: "#1b4d22", ml: 0.5 }}
            />
          </Box>
        </Box>

        {/* --- GRÁFICO DE BARRAS APILADAS --- */}
        <Box
          sx={{
            height: 160,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 2,
            pt: 1,
            position: "relative",
          }}
        >
          {chartData.map((data, index) => {
            const isSelected = data.month === "May";
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 110,
                    display: "flex",
                    flexDirection: "column-reverse",
                    borderRadius: "4px",
                    overflow: "hidden",
                    bgcolor: "#e0e0e0",
                  }}
                >
                  <Box
                    sx={{ height: `${data.values.inst}%`, bgcolor: "#387642" }}
                  />
                  <Box
                    sx={{ height: `${data.values.one}%`, bgcolor: "#93b399" }}
                  />
                  <Box
                    sx={{ height: `${data.values.auto}%`, bgcolor: "#0f3216" }}
                  />
                </Box>

                {isSelected ? (
                  <Box
                    sx={{
                      bgcolor: "#1b4d22",
                      color: "#fff",
                      px: 1,
                      borderRadius: "10px",
                      mt: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                      {data.month}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 11, color: "#888", mt: 0.5 }}>
                    {data.month}
                  </Typography>
                )}
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#444",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {data.total}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* --- LEYENDA DEL GRÁFICO --- */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#0f3216",
              }}
            />
            <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#000" }}>
              Automatic debits
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#387642",
              }}
            />
            <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#000" }}>
              Installments purchases
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#93b399",
              }}
            />
            <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#000" }}>
              One-time purchase
            </Typography>
          </Box>
        </Stack>

        {/* --- BOTÓN ADD CARD EXPENSE --- */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth // Hace que el botón ocupe todo el ancho de forma limpia en el flujo vertical
          sx={{
            bgcolor: "#2d5a37",
            color: "#fff",
            textTransform: "none",
            borderRadius: "10px",
            py: 1,
            mb: 3,
            fontWeight: 600,
            fontSize: 14,
            "&:hover": { bgcolor: "#1e3f26" },
          }}
        >
          Add Card Expense
        </Button>

        {/* --- SECCIÓN CARDS --- */}
        <Box
          sx={{
            width: "calc(100% + 40px)", // 🔥 CAMBIO AQUÍ: Compensa los márgenes negativos para que estire en ambos lados
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" }, // Oculta la barra de scroll
            mx: -2.5, // Desplaza el contenedor hacia los bordes de la pantalla
            px: 2.5, // Mantiene el contenido inicial alineado con el resto de la app
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "#555", fontSize: 16 }}>
            Cards
          </Typography>
        </Box>

        {/* Contenedor Vertical para las Tarjetas (Flujo natural con el scroll general) */}
        <Box
          sx={{
            width: "100%",
            overflowX: "auto", // Corrección: Propiedad nativa para scroll horizontal
            "&::-webkit-scrollbar": { display: "none" }, // Oculta la barra de scroll
            mx: -2.5, // Truco de diseño: expande el área de scroll hasta los bordes de la pantalla
            px: 2.5, // Mantiene el contenido alineado con el resto de la interfaz
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              pb: 1, // Pequeño espacio inferior para evitar que se corten sombras o bordes
            }}
          >
            {/* Renderizado dinámico de tarjetas */}
            {userCards.map((card) => {
              const isDark = card.theme === "dark";
              const bgColor = isDark ? "#35693c" : "#d8ebd9";
              const textColor = isDark ? "#fff" : "#689c6d";

              return (
                <Box
                  key={card.id}
                  sx={{
                    width: 290, // Ancho fijo para que la tarjeta se vea completa
                    flexShrink: 0, // Evita que Flexbox aplaste la tarjeta
                    height: 140,
                    bgcolor: bgColor,
                    borderRadius: "16px",
                    p: 2,
                    color: textColor,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Header de la tarjeta */}
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

                  {/* Número de tarjeta */}
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
                      •••• •••• ••••
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                      {card.number}
                    </Typography>
                  </Box>

                  {/* Información inferior (Fechas y Balance) */}
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
                        {card.balance}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {/* Tarjeta 3 (Botón para agregar una nueva tarjeta física) */}
            <Box
              sx={{
                width: 290, // Mismo ancho que las tarjetas anteriores
                flexShrink: 0, // Evita que se deforme
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
    </Box>
  );
}
