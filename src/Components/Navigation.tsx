import React, { useState } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import Inicio from "../Pages/Inicio";
import Conversor from "../Pages/Conversor/conversor";
import Unificador from "../Pages/Unificador/unificador";
import Emails from "../Pages/Emails/emails";
import Ayuda from "../Pages/Ayuda/Ayuda";
import logoAntea from "../logoAntea.webp";
import Buscador from "../Pages/Buscador/Buscador";
import Expropiaciones from "../Pages/Expropiaciones/Expropiaciones";
import Comparador from "../Pages/Comparador/Comparador";
import Festivos from "../Pages/Festivos/Festivos";
import GomasPacheco from "../Pages/GomasPacheco/gomasPacheco";

import "./estilo.css";

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
        <Tooltip title="Ayuda">
          <Link
            to={"/ayuda"}
            onClick={() => setActiveLink("")}
            className="ayuda-icon"
          >
            <img
              width={"35px"}
              height={"35px"}
              src={`${window.location.origin}${process.env.PUBLIC_URL}/help.svg`}
              alt="Logo de ayuda"
            />
          </Link>
        </Tooltip>
      </header>
      <div className="menu">
        <nav className="menu__nav">
          <Link
            to="/"
            onClick={() => setActiveLink("inicio")}
            className={activeLink === "inicio" ? "bold" : ""}
            style={{ marginLeft: "0" }}
          >
            Inicio
          </Link>
          <Link
            to="/conversor"
            onClick={() => setActiveLink("conversor")}
            className={activeLink === "conversor" ? "bold-xunta" : "xunta"}
            style={{ width: "120px" }}
          >
            Conversor Espiras-Gomas
          </Link>
          <Link
            to="/unificador"
            onClick={() => setActiveLink("unificador")}
            className={activeLink === "unificador" ? "bold-xunta" : "xunta"}
          >
            Unificador sentidos
          </Link>
          <Link
            to="/listadorGomas"
            onClick={() => setActiveLink("listadorGomas")}
            className={activeLink === "listadorGomas" ? "bold-xunta" : "xunta"}
          >
            Listador de gomas
          </Link>
          <Link
            to="/buscador"
            onClick={() => setActiveLink("buscador")}
            className={activeLink === "buscador" ? "bold" : ""}
          >
            Buscador de celdas
          </Link>
          <Link
            to="/accidentes"
            onClick={() => setActiveLink("accidentes")}
            className={activeLink === "accidentes" ? "bold-depo" : "depo"}
          >
            Accidentes DEPO
          </Link>
          <Link
            to="/email"
            onClick={() => setActiveLink("email")}
            className={activeLink === "email" ? "bold-depo" : "depo"}
            style={{ width: "120px" }}
          >
            Generador Emails DEPO
          </Link>
          <Link
            to="/festivos"
            onClick={() => setActiveLink("festivos")}
            className={activeLink === "festivos" ? "bold" : ""}
          >
            Festivos
          </Link>

          <Link
            to="/expropiaciones"
            style={{ width: "150px" }}
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
          <Route path="/accidentes" element={<Comparador />} />
          <Route path="/festivos" element={<Festivos />} />
          <Route path="/listadorGomas" element={<GomasPacheco />} />
          <Route path="/expropiaciones" element={<Expropiaciones />} />
          <Route path="/ayuda" element={<Ayuda />} />
        </Routes>
      </div>
    </>
  );
};

export default Navigation;
