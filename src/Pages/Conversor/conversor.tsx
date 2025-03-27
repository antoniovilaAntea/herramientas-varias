import FileConverter from "../../Components/FileConverter";

import "./conversor.css";

const Conversor = () => {
  return (
    <div className="conversor">
      <div className="descarga">
        <h3>Descargar Conversor</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/Ebo_KI0-PjlPoP6qZRg2O3EBvcWyuoYv619VrWdYPjF30g?e=TmFcH0"
          download={"Conversor txt en af1"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="online">
        <h3>Convertir un archivo .txt en un archivo de aforos (.af1)</h3>
        <FileConverter tipo="conversor"></FileConverter>
      </div>
    </div>
  );
};

export default Conversor;
