// Navigation.tsx
import React, { useState } from "react";
import { Route, Link, Routes } from "react-router-dom";
import Inicio from "../Pages/Inicio";
import Conversor from "../Pages/Conversor/conversor";
import Unificador from "../Pages/Unificador/unificador";
import Emails from "../Pages/Emails/emails";
import Ayuda from "../Pages/Ayuda/Ayuda";

import "./estilo.css";

const Navigation = () => {
  const [activeLink, setActiveLink] = useState("");

  return (
    <>
      <header>Herramientas</header>
      <div className="menu">
        <nav className="menu__nav">
          <Link
            to="/"
            onClick={() => setActiveLink("inicio")}
            className={activeLink === "inicio" ? "bold" : ""}
          >
            Inicio
          </Link>
          <Link
            to="/conversor"
            onClick={() => setActiveLink("conversor")}
            className={activeLink === "conversor" ? "bold" : ""}
          >
            Conversor
          </Link>
          <Link
            to="/unificador"
            onClick={() => setActiveLink("unificador")}
            className={activeLink === "unificador" ? "bold" : ""}
          >
            Unificador
          </Link>
          <Link
            to="/email"
            onClick={() => setActiveLink("email")}
            className={activeLink === "email" ? "bold" : ""}
          >
            Email
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/conversor" element={<Conversor />} />
          <Route path="/unificador" element={<Unificador />} />
          <Route path="/email" element={<Emails />} />
          <Route path="/ayuda" element={<Ayuda />} />
        </Routes>
      </div>
    </>
  );
};

export default Navigation;
