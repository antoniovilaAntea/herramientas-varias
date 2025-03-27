import React from "react";

import "./comparador.css";
import ExcelComparator from "../../Components/ExcelComparator";

const Comparador = () => {
  return (
    <div className="comparador">
      <div className="descarga">
        <h3>Descargar Comparador</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/EcwA5OSrQR9IlMs5s4qc_1YBX3YHOxt3covS2whtfu6kww?e=cJtrAa"
          download={"Comparador de celdas"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="online">
        <h3 style={{ paddingBottom: "1em" }}>
          Comparar dos excel y exportarlos en un mismo excel
        </h3>
        <ExcelComparator></ExcelComparator>
      </div>
    </div>
  );
};

export default Comparador;
