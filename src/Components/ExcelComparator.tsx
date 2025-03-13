import React, { useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRange, RangeKeyDict } from "react-date-range";
import { utils, writeFile } from "xlsx";
import { parse, isBefore, isAfter, format, isSameDay } from "date-fns";
import * as XLSX from "xlsx";

interface ProcessedData {
  datosConProvincial: any[][];
  datosCoincidentes: any[][];
  datosAnteriores: any[][];
  primeraFila: any[];
}

const ExcelComparator = () => {
  const [calendarOpacity, setCalendarOpacity] = useState(0);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const file1 = useRef<File | null>(null);
  const file2 = useRef<File | null>(null);

  const handleButtonClick = () => {
    setCalendarOpacity((prev) => (prev === 0 ? 1 : 0));
  };

  const seleccionarArchivo1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) file1.current = e.target.files[0];
  };

  const seleccionarArchivo2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) file2.current = e.target.files[0];
  };

  const readExcelFile = async (file: File): Promise<any[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            throw new Error("Error al leer el archivo");
          }

          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          resolve(jsonData as any[][]); // Añadir type assertion aquí
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const procesarDatos = (data1: any[][], data2: any[][]): ProcessedData => {
    const result: ProcessedData = {
      datosConProvincial: [],
      datosCoincidentes: [],
      datosAnteriores: [],
      primeraFila: [],
    };

    if (data1.length === 0) return result;

    result.primeraFila = data1[0];

    const fechaMinima = state[0].startDate;
    const fechaMaxima = state[0].endDate;

    const clavesArchivo2 = new Set(
      data2.slice(1).map((row) => String(row[0]?.toString().trim()))
    );

    for (let i = 1; i < data1.length; i++) {
      const row = data1[i];
      const celda11 = row[11]?.toString();
      const celda12 = row[12]?.toString();
      const contieneProvincial = [celda11, celda12].some((c) =>
        c.includes("Provincial")
      );

      if (!contieneProvincial) continue;

      const fechaStr = row[1];
      const fecha = parse(fechaStr, "dd/MM/yyyy HH:mm", new Date());
      if (
        isSameDay(fecha, fechaMinima) ||
        (isAfter(fecha, fechaMinima) &&
          (isSameDay(fecha, fechaMaxima) || isBefore(fecha, fechaMaxima)))
      ) {
        const clave = String(row[0]).trim();
        if (!clavesArchivo2.has(clave)) {
          result.datosCoincidentes.push(row);
        }
      }
      if (isBefore(fecha, fechaMinima)) {
        const clave = String(row[0]).trim();
        if (!clavesArchivo2.has(clave)) {
          result.datosAnteriores.push(row);
        }
      }

      result.datosConProvincial.push(row);
    }

    return result;
  };

  const btnExportarClick = async () => {
    if (!file1.current || !file2.current) return;

    const data1 = await readExcelFile(file2.current);
    const data2 = await readExcelFile(file1.current);

    const {
      datosConProvincial,
      datosCoincidentes,
      datosAnteriores,
      primeraFila,
    } = procesarDatos(data1, data2);

    const wb = utils.book_new();

    const crearHoja = (datos: any[][], nombreHoja: string) => {
      const ws = utils.aoa_to_sheet([primeraFila, ...datos]);
      utils.book_append_sheet(wb, ws, nombreHoja);
    };

    crearHoja(datosConProvincial, "Todos");
    crearHoja(
      datosCoincidentes,
      `${format(state[0].startDate, "dd.MM.yy")} - ${format(state[0].endDate, "dd.MM.yy")}`
    );
    crearHoja(
      datosAnteriores,
      `Anteriores al ${format(state[0].startDate, "dd.MM.yy")}`
    );

    writeFile(wb, "resultado.xlsx");
  };

  return (
    <div className="comparar">
      <div className="boton-unir">
        <button onClick={handleButtonClick}>
          {state[0].startDate &&
          state[0].endDate &&
          state[0].startDate.toLocaleDateString() !==
            state[0].endDate.toLocaleDateString()
            ? `${state[0].startDate
                .toLocaleDateString()
                .replaceAll("/", ".")} - ${state[0].endDate
                .toLocaleDateString()
                .replaceAll("/", ".")}`
            : "Selecciona un rango de fecha"}
        </button>
      </div>

      <div
        className="calendar"
        style={{
          display: calendarOpacity === 0 ? "none" : "block",
          opacity: calendarOpacity,
        }}
      >
        <DateRange
          editableDateInputs={true}
          onChange={(item: RangeKeyDict) => {
            const selection = item.selection;
            setState([
              {
                startDate: selection.startDate ?? new Date(),
                endDate: selection.endDate ?? new Date(),
                key: "selection", // Usar una clave fija
              },
            ]);
          }}
          moveRangeOnFirstSelection={false}
          ranges={state}
          showMonthAndYearPickers={false}
          weekStartsOn={1}
          rangeColors={["#4a6fa5ff"]}
        />
      </div>

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
        <button onClick={btnExportarClick}>Exportar Excel</button>
      </div>
    </div>
  );
};

export default ExcelComparator;
