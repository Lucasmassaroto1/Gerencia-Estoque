import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login.jsx";
import Register from "./register.jsx";
import Home from "./home.jsx";
import Products from "./products.jsx";
import Clients from "./clients.jsx";
import Sales from "./sales.jsx";
import Repairs from "./repairs.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/repairs" element={<Repairs />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")).render(<App />);
