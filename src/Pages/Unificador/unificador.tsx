import FileConverter from "../../Components/FileConverter";

import "./unificador.css";

const Unificador = () => {
  return (
    <div className="conversor">
      <div className="descarga">
        <h3>Descargar Unificador</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/EXXz2q9XOuNPrE7pfStlfxoBEMkilHENsCSveexIGTouuw?e=dgzia2"
          download={"Unificador afIda y afVuelta"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="online">
        <h3 style={{ textAlign: "center" }}>
          Unir archivos de espiras creciente y decreciente
        </h3>
        <div className="unir">
          <FileConverter tipo="unificador"></FileConverter>
        </div>
      </div>
    </div>
  );
};

export default Unificador;
