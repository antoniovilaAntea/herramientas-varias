// Navigation.tsx
import React, { useState } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import Inicio from "../Pages/Inicio";
import Conversor from "../Pages/Conversor/conversor";
import Unificador from "../Pages/Unificador/unificador";
import Emails from "../Pages/Emails/emails";
import Ayuda from "../Pages/Ayuda/Ayuda";
import logoAntea from "../logoAntea.webp";
import "./estilo.css";
import Buscador from "../Pages/Buscador/Buscador";
import Expropiaciones from "../Pages/Expropiaciones/Expropiaciones";
import Comparador from "../Pages/Comparador/Comparador";

const Navigation = () => {
  let location = useLocation();
  const [activeLink, setActiveLink] = useState(
    location.pathname.split("/")[1] === ""
      ? "inicio"
      : location.pathname.split("/")[1]
  );

  return (
    <>
      <header className="header-container">
        <div className="header-content">
          <Link to="/" onClick={() => setActiveLink("inicio")} className="logo">
            <img
              alt="Logo AnteaGroup"
              width="80px"
              height="43px"
              src={logoAntea}
            />
          </Link>
        </div>
        <div className="header-text">Herramientas</div>
      </header>
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
          <Link
            to="/buscador"
            onClick={() => setActiveLink("buscador")}
            className={activeLink === "buscador" ? "bold" : ""}
          >
            Buscador
          </Link>
          <Link
            to="/comparador"
            onClick={() => setActiveLink("comparador")}
            className={activeLink === "comparador" ? "bold" : ""}
          >
            Comparador
          </Link>
          <Link
            to="/expropiaciones"
            onClick={() => setActiveLink("expropiaciones")}
            className={activeLink === "expropiaciones" ? "bold" : ""}
          >
            Expropiaciones
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/conversor" element={<Conversor />} />
          <Route path="/unificador" element={<Unificador />} />
          <Route path="/email" element={<Emails />} />
          <Route path="/buscador" element={<Buscador />} />
          <Route path="/comparador" element={<Comparador />} />
          <Route path="/expropiaciones" element={<Expropiaciones />} />
          <Route path="/ayuda" element={<Ayuda />} />
        </Routes>
      </div>
    </>
  );
};

export default Navigation;
