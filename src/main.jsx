import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NanzasProject from "./components/proyects/nanzas/nanzas.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/project/nanzas" element={<NanzasProject />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
