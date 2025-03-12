import React, { useState } from "react";
import * as XLSX from "xlsx";

import "./cellBrowser.css";

const CellBrowser = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cellInput, setCellInput] = useState("");

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleCellInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellInput(e.target.value);
  };

  const convertirDesignacionCelda = (designacion: any) => {
    let letras = designacion.match(/[A-Z]+/)[0];
    let numeros = parseInt(designacion.match(/\d+/)[0], 10);
    let columna = 0;

    for (let i = 0; i < letras.length; i++) {
      columna = columna * 26 + (letras.charCodeAt(i) - "A".charCodeAt(0) + 1);
    }
    return { c: columna, r: numeros };
  };

  const exportToExcel = () => {
    const cellReferences = cellInput
      .toUpperCase()
      .split(",")
      .map((cell) => `Celda ${cell.trim()}`);

    if (selectedFiles.length === 0 || cellInput.trim() === "") {
      alert("Por favor seleccione archivos y/o ingrese celdas.");
      return;
    }

    const data: { [key: string]: { [key: string]: string } } = {};

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const workbook = XLSX.read(e.target.result as string, {
            type: "binary",
          });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          cellReferences.forEach((cellRef) => {
            const cellAddress = convertirDesignacionCelda(
              cellRef.replace("Celda ", "")
            );
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
            }) as any[][];
            const cellValue = jsonData[cellAddress.r - 1]?.[cellAddress.c - 1];
            data[file.name] = {
              ...data[file.name],
              [cellRef]: cellValue,
            };
          });

          const newData = [];
          for (const [key, value] of Object.entries(data)) {
            const row = [key];
            cellReferences.forEach((cellRef) => {
              row.push((value as { [key: string]: string })[cellRef] || "");
            });
            newData.push(row);
          }

          const newWorkbook = XLSX.utils.book_new();
          const newWorksheet = XLSX.utils.aoa_to_sheet([
            ["Nombre del Archivo", ...cellReferences],
            ...newData,
          ]);
          XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Datos");
          XLSX.writeFile(newWorkbook, "SALIDA.xlsx");
        }
      };

      reader.readAsBinaryString(file);
    });
  };
  return (
    <div className="contenedor">
      <div>
        <div className="celdas">
          <label>Celdas: </label>
          <input
            type="text"
            placeholder="celda,celda1,celda2..."
            value={cellInput}
            onChange={handleCellInputChange}
          />
        </div>
        <div className="btnSeleccion">
          <label>Selecciona archivo/s Excel</label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile2"
            placeholder="Seleccionar archivo/s Excel"
            accept=".xlsx, .xlsm, .xls"
            multiple
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      <div className="boton">
        <button onClick={exportToExcel}>Exportar a nuevo archivo Excel</button>
      </div>
    </div>
  );
};

export default CellBrowser;
