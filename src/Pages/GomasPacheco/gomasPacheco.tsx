import React from "react";
import ExcelProcessor from "../../Components/ExcelProcessor";

const GomasPacheco = () => {
  return (
    <>
      <div className="descarga">
        <h3>Descargar .zip</h3>
        <div>
          <a
            href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/EUudlajm6ehIjacutpl0AfIBb58AjzJpfqEL6axCQv5vWQ?e=g780wz"
            download={"Transformador Excel Gomas"}
            target="_blank"
            rel="noreferrer"
          >
            <button>Descargar .zip</button>
          </a>
        </div>
      </div>
      <ExcelProcessor></ExcelProcessor>
    </>
  );
};

export default GomasPacheco;
