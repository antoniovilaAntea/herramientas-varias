// Navigation.tsx
import React from "react";
import { Route, Link, Routes } from "react-router-dom";
import Inicio from "../Pages/Inicio";
import Conversor from "../Pages/Conversor/conversor";
import Unificador from "../Pages/Unificador/unificador";
import Emails from "../Pages/Emails/emails";

import "./estilo.css";
import Ayuda from "../Pages/Ayuda/Ayuda";

const Navigation = () => {
  return (
    <>
      <header>Herramientas variadas</header>
      <div className="menu">
        <nav className="menu__nav">
          <Link to="/">Inicio</Link>
          <Link to="/conversor">Conversor</Link>
          <Link to="/unificador">Unificador</Link>
          <Link to="/email">Email</Link>
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
