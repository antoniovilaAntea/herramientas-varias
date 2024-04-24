import React, { useState } from "react";

const ExcelComparator = () => {
  const [archivoUno, setArchivoUno] = useState<File>();
  const [archivoDos, setArchivoDos] = useState<File>();

  const seleccionarArchivo1 = (event: any) => {
    const archivo = event.target.files[0];
    setArchivoUno(archivo);
  };
  const seleccionarArchivo2 = (event: any) => {
    const archivo = event.target.files[0];
    setArchivoDos(archivo);
  };

  return (
    <div className="comparar">
      <div className="botones">
        <div className="archivo">
          <label className="input-group-text" htmlFor="inputGroupFile">
            Examinar
          </label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile"
            placeholder="Ningún archivo seleccionado"
            onChange={seleccionarArchivo1}
          />
        </div>

        <div className="archivo2">
          <label className="input-group-text" htmlFor="inputGroupFile2">
            Examinar
          </label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile2"
            placeholder="Ningún archivo seleccionado"
            onChange={seleccionarArchivo2}
          />
        </div>
      </div>
      <div className="boton-unir">
        <button>Exportar Excel</button>
      </div>
    </div>
  );
};

export default ExcelComparator;
