import React from "react";

import "./conversor.css";
import FileConverter from "../../Components/FileConverter";

const Conversor = () => {
  return (
    <div className="conversor">
      <div className="descarga">
        <h3>Descargar Conversor</h3>
        <a
          href="/Conversor_File/Aplicación Transformar txt en archivo de Aforos.zip"
          download={"Conversor txt en af1"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div>
        <h3>Convertir un archivo .txt en un archivo de aforos (.af1)</h3>
        <FileConverter></FileConverter>
      </div>
    </div>
  );
};

export default Conversor;
