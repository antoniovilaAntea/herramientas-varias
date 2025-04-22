import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Notification from "./Notification";
import { CircularProgress, Box } from "@mui/material";

import "./cellBrowser.css";

const CellBrowser = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cellInput, setCellInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      showNotification("Archivos seleccionados correctamente", "success");
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
      showNotification(
        "Por favor seleccione archivos y/o ingrese celdas",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const newData: any[][] = [];

      const processFile = async (file: File): Promise<void> => {
        const reader = new FileReader();
        const result = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.onerror = reject;
          reader.readAsBinaryString(file);
        });

        const workbook = XLSX.read(result, { type: "binary" });
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
          const cellValue = jsonData[cellAddress.r - 1]?.[cellAddress.c - 1];
          row.push(cellValue || "");
        });

        newData.push(row);
      };

      const results = await Promise.all(selectedFiles.map(processFile));

      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.aoa_to_sheet([
        ["Nombre del Archivo", ...cellReferences],
        ...newData,
      ]);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Datos");

      const excelBuffer = XLSX.write(newWorkbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        "SALIDA.xlsx"
      );

      showNotification("Archivo exportado exitosamente", "success");
    } catch (error) {
      console.error("Error procesando archivos:", error);
      showNotification("Ocurrió un error al procesar los archivos", "error");
    } finally {
      setLoading(false);
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
        <button onClick={exportToExcel} disabled={loading}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} color="inherit" />
              <span style={{ marginLeft: "8px" }}>Exportando...</span>
            </Box>
          ) : (
            "Exportar a nuevo archivo Excel"
          )}
        </button>
      </div>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default CellBrowser;
