import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import "./estilo.css";

interface Registro {
  Número: any;
  Estrada: string;
  Treito: string;
  Provincia: string;
  Concello: string;
  Ubicación: string;
  Observacións: string;
  "Aforado en": string;
  Afín: string;
}
const ExcelProcessor = () => {
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processExcel = (data: any): [any[], Registro[]] => {
    const rows = utils.sheet_to_json(data, { header: 1, defval: "" });
    const header = rows.slice(0, 3);
    const dataRows = rows.slice(3);

    const registros: Registro[] = [];
    let registroActual: Registro = {
      Número: "",
      Estrada: "",
      Treito: "",
      Provincia: "",
      Concello: "",
      Ubicación: "",
      Observacións: "",
      "Aforado en": "",
      Afín: "",
    };

    dataRows.forEach((row: any) => {
      const cellValue = row[1] || "";
      if (cellValue.trim() === "Estrada:") {
        if (registroActual.Estrada !== "") registros.push(registroActual);
        registroActual = {
          Número: row[0],
          Estrada: row[2],
          Treito: "",
          Provincia: "",
          Concello: "",
          Ubicación: "",
          Observacións: "",
          "Aforado en": "",
          Afín: "",
        };
      } else if (cellValue.trim() === "Treito:") registroActual.Treito = row[2];
      else if (cellValue.trim() === "Provincia:")
        registroActual.Provincia = row[2];
      else if (cellValue.trim() === "Concello:")
        registroActual.Concello = row[2];
      else if (cellValue.trim() === "Ubicación:") {
        const ubicacion = (row[2] || "")
          .toString()
          .replace(/(en\s*)?pk\s*/gi, "")
          .trim();
        if (ubicacion !== "NaN") registroActual.Ubicación = ubicacion;
      } else if (cellValue.trim() === "Observacións:") {
        let texto = (row[2] || "").toString();

        const afinMatch = texto.match(
          /A estación afín será\s*(?:[a-z]\s)*([A-Z]{2,}-\d+(?:\.\d+)?\(\d+\)[A-Z]*)/i
        );
        if (afinMatch) {
          registroActual.Afín = afinMatch[1];
          texto = texto.replace(afinMatch[0], "");
        }

        const aforos: string[] = [];
        const aforoRegex =
          /Aforado en\s*([a-z]+[\s-]*\d{4}).*?pk\s*([\d,]+).*?(?:con\s*([\d,.]+))? veh\/día/gi;
        let match;
        while ((match = aforoRegex.exec(texto)) !== null) {
          aforos.push(
            `Aforado en ${match[1]} PK ${match[2]} con ${match[3] || "0"} veh/día`
          );
          texto = texto.replace(match[0], "");
        }
        registroActual["Aforado en"] = aforos.join("\n");

        registroActual.Observacións = texto
          .trim()
          .replace(/^./, (c: string) => c.toUpperCase());
      }
    });

    if (registroActual.Estrada !== "") registros.push(registroActual);
    return [header, registros];
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    setError("");

    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const wb = read(data);
      const [header, registros] = processExcel(wb.Sheets[wb.SheetNames[0]]);

      const newWb = utils.book_new();

      // Crear hoja vacía
      const newWs = utils.aoa_to_sheet([]);

      // 1. Añadir cabecera original (3 primeras filas)
      utils.sheet_add_aoa(newWs, header, { origin: "A1" });

      // 2. Añadir títulos de columnas en fila 4
      if (registros.length > 0) {
        const columnTitles = Object.keys(registros[0]);
        utils.sheet_add_aoa(newWs, [columnTitles], { origin: "A4" });
      }

      // 3. Añadir datos a partir de fila 5
      utils.sheet_add_json(newWs, registros, {
        origin: "A5",
        skipHeader: true,
      });

      // Ajustar columnas
      const cols: { width: number }[] = [];
      utils.sheet_to_json(newWs, { header: 1 }).forEach((row: any) => {
        row.forEach((cell: any, idx: number) => {
          const length = cell?.toString().length || 0;
          cols[idx] = {
            width: Math.min(Math.max(cols[idx]?.width || 0, length + 2), 38),
          };
        });
      });
      newWs["!cols"] = cols;

      utils.book_append_sheet(newWb, newWs, "Datos");

      writeFile(
        newWb,
        `procesado_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err: any) {
      setError(`Error al procesar el archivo: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
      className="gomasPacheco"
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Transformador Gomas{" "}
      </h3>
      <div className="btnSeleccion">
        <label htmlFor="excelfile">Seleccionar archivo</label>
        <input
          id="excelfile"
          placeholder="Seleccionar archivo/s Excel"
          className="form-control"
          type="file"
          accept=".xlsx"
          onChange={handleFile}
          disabled={isProcessing}
        />
        {isProcessing && (
          <div style={{ textAlign: "center", padding: "10px", color: "#666" }}>
            Procesando archivo, por favor espere...
          </div>
        )}
        {error && (
          <div
            style={{
              color: "red",
              padding: "10px",
              backgroundColor: "#ffeeee",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelProcessor;
