import ExpropiacionesConverter from "../../Components/ExpropiacionesConverter";
import "./Expropiaciones.css";
const Expropiaciones = () => {
  return (
    <div className="conversor">
      <div className="descarga">
        <h3>Descargar Conversor - Expropiaciones - </h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/ETRVgFlWBS5Jqq44Khz28gABVngccGbNVARipowEl4kkqg?e=DAJdYi"
          download={"Conversor .xlsx en xml"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="online">
        <h3>Convertir un archivo .xlsx en un XML</h3>
        <ExpropiacionesConverter></ExpropiacionesConverter>
      </div>
    </div>
  );
};

export default Expropiaciones;
