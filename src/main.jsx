import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";      // customer page
import Admin from "./Admin.jsx";  // admin page
import QRCodePage from "./QRCodePage.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/qr" element={<QRCodePage />} />

    </Routes>
  </BrowserRouter>
);
