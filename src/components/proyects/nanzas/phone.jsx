import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

import { colors } from "./colors.js";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardScreen from "./screens/DashboardScreen";
import BottomNavBar from "./BottomNavBar.jsx";
import PaymentListScreen from "./screens/PaymentListScreen.jsx";
import NewTransactionScreen from "./screens/NewTransactionScreen";
import CategoriesScreen from "./screens/CategoriesScreen.jsx";
import SummaryScreen from "./screens/SummaryScreen.jsx";
import HistoryScreen from "./screens/HistoryScreen.jsx";
import CardsScreen from "./screens/CardsScreen.jsx";

//for paymentlist DEFAULT
const initialPayments = [
  { id: 1, name: "Gary's Food", category: "Pets", amount: 15, paid: true },
  { id: 2, name: "Internet", category: "Services", amount: 635, paid: true },
  { id: 3, name: "Gym", category: "Health", amount: 80, paid: false },
  { id: 4, name: "Rent", category: "House", amount: 470, paid: false },
  {
    id: 5,
    name: "Electricity",
    category: "Services",
    amount: 420,
    paid: false,
  },
];

export default function PhoneMockup() {
  const phoneRef = useRef(null);
  const [currentScreen, setCurrentScreen] = useState("login");
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("nanzas_payments");
    return saved ? JSON.parse(saved) : initialPayments;
  });
  const [screenParams, setScreenParams] = useState(null);
  const handleNavigation = (screenId, params = null) => {
    setCurrentScreen(screenId);
    setScreenParams(params);
  };
  const screens = {
    dashboard: (
      <DashboardScreen
        payments={payments}
        onChange={handleNavigation}
        phoneContainerRef={phoneRef}
      />
    ),
    paymentlist: (
      <PaymentListScreen
        payments={payments}
        setPayments={setPayments}
        onBack={() => setCurrentScreen("dashboard")}
      />
    ),
    // ← nuevo
    newtransaction: (
      <NewTransactionScreen
        onBack={() => setCurrentScreen("dashboard")}
        params={screenParams}
      />
    ),
    categories: (
      <CategoriesScreen
        onBack={() => setCurrentScreen("dashboard")}
        phoneContainerRef={phoneRef}
      />
    ),
    summary: <SummaryScreen onChange={handleNavigation} />,

    history: (
      <HistoryScreen
        onBack={() => setCurrentScreen("dashboard")}
        onChange={handleNavigation}
        phoneContainerRef={phoneRef}
      />
    ),
    cards: <CardsScreen />,
  };

  useEffect(() => {
    localStorage.setItem("nanzas_payments", JSON.stringify(payments));
  }, [payments]);

  return (
    <Box
      ref={phoneRef}
      sx={{
        width: 320,
        height: 680,
        borderRadius: "44px",
        border: "10px solid #1a1a1a",
        bgcolor: colors.bgGreen,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 0 1px #333, 0 24px 48px rgba(0,0,0,0.25)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ==========================================
          HEADER / STATUS BAR 
          ========================================== */}
      <Box
        sx={{
          pt: "18px",
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
          9:41
        </Typography>

        {/* Dynamic Island */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 110,
            height: 32,
            bgcolor: "black",
            borderRadius: "16px",
          }}
        />

        {/* Iconos derechos (Señal, Wifi, Batería) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>ıll</Typography>
          <Typography sx={{ fontSize: 12 }}>🛜</Typography>
          <Box
            sx={{
              width: 22,
              height: 11,
              border: "1px solid #111",
              borderRadius: "3px",
              position: "relative",
              ml: 0.5,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 1,
                bgcolor: "#111",
                borderRadius: "1px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: -3,
                top: "2.5px",
                width: 2,
                height: 4,
                bgcolor: "#111",
                borderRadius: "0 1px 1px 0",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ==========================================
          ENRUTADOR DINÁMICO DE PANTALLAS
          ========================================== */}
      {currentScreen === "login" && (
        <LoginScreen
          onLogin={() => handleNavigation("dashboard")}
          onNavigateToSignup={() => handleNavigation("signup")}
        />
      )}

      {currentScreen === "signup" && (
        <SignupScreen
          onLogin={() => handleNavigation("dashboard")}
          onNavigateToLogin={() => handleNavigation("login")}
        />
      )}

      {currentScreen !== "signup" && currentScreen !== "login" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {screens[currentScreen]}

          <BottomNavBar onChange={handleNavigation} />
        </Box>
      )}

      {/* ==========================================
          FOOTER / HOME INDICATOR (Fijo para todas las pantallas)
          ========================================== */}
      <Box
        sx={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 5,
          bgcolor: "#1a1a1a",
          borderRadius: "4px",
          zIndex: 10,
        }}
      />
    </Box>
  );
}
