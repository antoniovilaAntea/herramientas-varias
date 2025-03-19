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
  const exportToExcel = async () => {
    const cellReferences = cellInput
      .toUpperCase()
      .split(",")
      .map((cell) => `Celda ${cell.trim()}`);

    if (selectedFiles.length === 0 || cellInput.trim() === "") {
      alert("Por favor seleccione archivos y/o ingrese celdas.");
      return;
    }

    const newData: any[][] = [];

    const processFile = (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const workbook = XLSX.read(e.target.result as string, {
              type: "binary",
            });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
            }) as any[][];

            const row = [file.name];
            cellReferences.forEach((cellRef) => {
              const cellAddress = convertirDesignacionCelda(
                cellRef.replace("Celda ", "")
              );
              const cellValue =
                jsonData[cellAddress.r - 1]?.[cellAddress.c - 1];
              row.push(cellValue || "");
            });

            newData.push(row);
            resolve();
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
      });
    };

    try {
      await Promise.all(selectedFiles.map(processFile));

      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.aoa_to_sheet([
        ["Nombre del Archivo", ...cellReferences],
        ...newData,
      ]);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Datos");
      XLSX.writeFile(newWorkbook, "SALIDA.xlsx");
    } catch (error) {
      console.error("Error procesando archivos:", error);
      alert("Ocurrió un error al procesar los archivos.");
    }
  };

  return (
    <div className="contenedor">
      <div>
        <div className="celdas">
          <label htmlFor="inputcelda">Celdas: </label>
          <input
            id="inputcelda"
            type="text"
            placeholder="A1,B2,C3..."
            value={cellInput}
            onChange={handleCellInputChange}
          />
        </div>
        <div className="btnSeleccion">
          <label htmlFor="inputGroupFile2">Selecciona archivo/s Excel</label>
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
