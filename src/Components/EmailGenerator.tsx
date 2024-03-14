import React, { useState } from "react";
import * as XLSX from "xlsx";
import isEqual from "lodash/isEqual";

import "./emailGenerator.css";

function EmailGenerator() {
  const [excelData, setExcelData] = useState<any[]>([]);
  //variables a guardar para pasar al archivo word
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [instalar, setInstalar] = useState(false);
  const [retirar, setRetirar] = useState(false);
  const [inicioSemana, setInicioSemana] = useState<string>();
  const [finSemana, setFinSemana] = useState<string>();
  const [fecha, setFecha] = useState<string>();

  const [datos, setDatos] = useState([{}]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target?.result as string, {
        type: "binary",
      });
      const sheetName = workbook.SheetNames[1];
      const sheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const filteredData = data.map((row: any[]) => [
        row[0],
        row[3],
        row[4] !== "PK" && row[4] !== undefined
          ? ((parseInt(row[4]) - (parseInt(row[4]) % 1000)) / 1000).toString() +
            " + " +
            ((row[4] % 1000).toString().length === 2
              ? "0" + (row[4] % 1000).toString()
              : (row[4] % 1000).toString().length === 1
              ? "00" + (row[4] % 1000).toString()
              : (row[4] % 1000).toString())
          : row[4],
        row[5],
      ]);

      setExcelData(filteredData);
    };

    reader.readAsBinaryString(file as Blob);
  };

  const handleRowClick = (rowIndex: number, row: any[]) => {
    if (selectedRows.some((selectedRow) => isEqual(selectedRow, row))) {
      setSelectedRows(
        selectedRows.filter((selectedRow) => !isEqual(selectedRow, row))
      );
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const exportarDatos = () => {
    // AQUI HAY QUE PONER EL CODIGO PARA EXPORTAR A UN ARCHIVO DE WORD
    console.log(datos);
    //El filter de abajo lo que hace es devovler todos los elementos que CONTENGAN en fecha ' Lunes 12'
    // @ts-ignore
    console.log(datos.filter((elemento) => elemento.fecha === "Lunes 12"));
  };

  const anadirDatos = () => {
    const tipo = instalar ? "Instalar" : retirar ? "Retirar" : "No tipo";
    const hayDuplicadosEnDatos = datos.some(
      (obj) =>
        JSON.stringify(obj) ===
        JSON.stringify({ inicioSemana, finSemana, fecha, tipo, selectedRows })
    );
    !hayDuplicadosEnDatos
      ? setDatos([
          ...datos,
          { inicioSemana, finSemana, fecha, tipo, selectedRows },
        ])
      : alert("Ya hay un elemento igual");

    console.log(datos);
    return hayDuplicadosEnDatos;
  };

  return (
    <div className="email">
      <div className="email-importar">
        <label>Selecciona Excel</label>
        <input id="input-file" type="file" onChange={handleFileUpload} />
      </div>
      <div className="formulario">
        <div className="semana">
          <label>Semana de </label>
          <input
            placeholder="dd/MM"
            type="text"
            value={inicioSemana}
            onChange={(e) => setInicioSemana(e.target.value!)}
          />
          <label> a </label>
          <input
            placeholder="dd/MM"
            type="text"
            value={finSemana}
            onChange={(e) => setFinSemana(e.target.value!)}
          />
        </div>
        <div className="fecha">
          <label>Fecha</label>
          <input
            type="text"
            placeholder="Ej: Lunes 12"
            value={fecha}
            onChange={(e) => setFecha(e.target.value!)}
          />
          <div className="checkboxes">
            <input
              type="checkbox"
              name="Instalar"
              id="instalar"
              checked={instalar}
              onChange={() => {
                setInstalar(!instalar);
                setRetirar(false);
                console.log(selectedRows);
              }}
            />
            <label htmlFor="instalar">Instalar</label>
            <input
              type="checkbox"
              name="Retirar"
              id="retirar"
              checked={retirar}
              onChange={() => {
                setRetirar(!retirar);
                setInstalar(false);
              }}
            />
            <label htmlFor="retirar">Retirar</label>
          </div>
        </div>
        <div className="exportar">
          <button
            onClick={() => {
              anadirDatos()
                ? console.log("")
                : alert("Añadidos " + selectedRows.length + " datos");
            }}
          >
            Añadir
          </button>
          <button onClick={exportarDatos}>Exportar</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {excelData.length > 0 &&
              excelData[0].map((cell: any, index: number) => (
                <th key={index}>{cell}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row: any[], rowIndex: number) => {
            const isRowEmpty = row.every((cell) => cell === undefined);
            if (!isRowEmpty) {
              return (
                <tr
                  key={rowIndex}
                  onClick={() => handleRowClick(rowIndex, row)}
                  style={{
                    background: selectedRows.includes(row)
                      ? "lightblue"
                      : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmailGenerator;
