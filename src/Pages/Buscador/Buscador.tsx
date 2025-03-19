import React from "react";

import "./buscador.css";
import CellBrowser from "../../Components/CellBrowser";

const Buscador = () => {
  return (
    <div className="buscador">
      <div className="descarga">
        <h3>Descargar Buscador</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/Ecpb5-YmYV9Kk0QJc1h9RtUBa0SgOJB1jdZ2OIs0Wn8YQA?e=gS62Uu"
          download={"Buscador de celdas"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="texto">
        <h3>Buscar valor de celdas en un Excel</h3>
        <CellBrowser></CellBrowser>
      </div>
    </div>
  );
};

export default Buscador;
