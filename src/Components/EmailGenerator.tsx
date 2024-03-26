import React, { useState } from "react";
import * as XLSX from "xlsx";
import isEqual from "lodash/isEqual";

import "./emailGenerator.css";

function EmailGenerator() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [instalar, setInstalar] = useState(false);
  const [retirar, setRetirar] = useState(false);
  const [inicioSemana, setInicioSemana] = useState<string>();
  const [finSemana, setFinSemana] = useState<string>();
  const [fecha, setFecha] = useState<string>();
  const [datos, setDatos] = useState<any[]>([]);

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

  const handleSendEmail = () => {
    const emailBody = createEmailBody(datos);
    openOutlook(emailBody);
  };

  const createEmailBody = (data: any[]) => {
    let emailBody = "\n\n";

    const groupedData: { [key: string]: any[][] } = {};
    data.forEach((item) => {
      const key = `${item.fecha}-${item.tipo}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key] = groupedData[key].concat(item.selectedRows);
    });

    let lastDate = "";
    Object.keys(groupedData).forEach((key, index) => {
      const [fecha, tipo] = key.split("-");
      if (fecha !== lastDate) {
        emailBody += `${fecha.toUpperCase()}\n\n`;
        lastDate = fecha;
      }
      emailBody += `Gomas a ${tipo.toString().toUpperCase()}:\n`;
      groupedData[key].forEach((row: any) => {
        emailBody += "• " + row.join(" - ") + "\n";
      });

      if (index < Object.keys(groupedData).length - 1) {
        emailBody += "\n";
      }
    });
    driveLinks(datos);
    emailBody += "\n";
    emailBody += rutas.join("\n\n");

    return encodeURIComponent(emailBody);
  };
  const openOutlook = (emailBody: string) => {
    const emailSubject = encodeURIComponent(
      `PROGRAMACIÓN AFOROS DEPO ${new Date().getFullYear()}, SEMANA DEL ${datos
        .map((e) => e.inicioSemana)
        .filter((value, index, self) => self.indexOf(value) === index) // Filtrar fechas duplicadas
        .join(", ")} AL ${datos
        .map((e) => e.finSemana)
        .filter((value, index, self) => self.indexOf(value) === index) // Filtrar fechas duplicadas
        .join(", ")}:`
    );

    const mailtoLink = `mailto:ignaciocubero@anteagroup.es;juanguerra@anteagroup.es&subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoLink;
  };

  const manjearBotones = () => {
    setMostrarBotones(!mostrarBotones);
  };

  const unselectAll = () => {
    setSelectedRows([]);
  };

  const anadirDatos = () => {
    const tipo = instalar ? "Instalar" : retirar ? "Retirar" : "No tipo";
    const hayDuplicadosEnDatos = datos.some(
      (obj) =>
        JSON.stringify(obj) ===
        JSON.stringify({ inicioSemana, finSemana, fecha, tipo, selectedRows })
    );
    if (!hayDuplicadosEnDatos) {
      setDatos([
        ...datos,
        { inicioSemana, finSemana, fecha, tipo, selectedRows },
      ]);
    } else {
      alert("Ya hay un elemento igual");
    }

    return hayDuplicadosEnDatos;
  };

  let rutas: any[] = [];
  const driveLinks = (datos: any[]) => {
    const gruposUnicos: string[] = [];
    datos.forEach((item) => {
      item.selectedRows.forEach((row: any[]) => {
        const grupo = row[0]; // El primer elemento de la matriz es el grupo
        if (!gruposUnicos.includes(grupo)) {
          gruposUnicos.push(grupo);
        }
      });
    });
    gruposUnicos.map((letra) => {
      if (letra === "A") {
        rutas.push(
          "Enlaces Maps grupo A: https://www.google.com/maps/d/edit?mid=1GSOBFKzC07iY5GV5UjrwBfyFIEQ3sHg&usp=sharing"
        );
      }
      if (letra === "B") {
        rutas.push(
          "Enlaces Maps grupo B: https://www.google.com/maps/d/edit?mid=1OPe70UmLtYg1d5HjFOEQxMGLIcLkq14&usp=sharing"
        );
      }
      if (letra === "C") {
        rutas.push(
          "Enlaces Maps grupo C: https://www.google.com/maps/d/edit?mid=1Uo0L2YGIik2VCy4oehIWOUB9AeMLvts&usp=sharing"
        );
      }
      if (letra === "D") {
        rutas.push(
          "Enlaces Maps grupo D: https://www.google.com/maps/d/edit?mid=1hSFVByMtXvw84PiCjCo6tiboTo5-MME&usp=sharing"
        );
      }
      if (letra === "E") {
        rutas.push(
          "Enlaces Maps grupo E: https://www.google.com/maps/d/edit?mid=1UioRCBbjASI7Y3qveZ38EzFGe-8VYBY&usp=sharing"
        );
      }
      if (letra === "F") {
        rutas.push(
          "Enlaces Maps grupo F: https://www.google.com/maps/d/edit?mid=1-YvDj0MAiEffy1lVzlDrve4bAW-oT3c&usp=sharing"
        );
      }
      if (letra === "G") {
        rutas.push(
          "Enlaces Maps grupo G: https://www.google.com/maps/d/edit?mid=1gPj5riwfFfoTRPuvUb7VcwkFtnhmrxM&usp=sharing"
        );
      }
      if (letra === "H") {
        rutas.push(
          "Enlaces Maps grupo H: https://www.google.com/maps/d/edit?mid=1jXPp6Qr1e8LVEgachKnxqM9v335GLmU&usp=sharing"
        );
      }
      if (letra === "I") {
        rutas.push(
          "Enlaces Maps grupo I: https://www.google.com/maps/d/edit?mid=19DWbKHrepom79sm4uuyAPnByL8Z4oWQ&usp=sharing"
        );
      }
      if (letra === "J") {
        rutas.push(
          "Enlaces Maps grupo J: https://www.google.com/maps/d/edit?mid=1rz1zPzRJu9CnDyR2gD2W-goapP06OME&usp=sharing"
        );
      }
    });

    console.log(rutas);
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
            onChange={(e) => setInicioSemana(e.target.value)}
          />
          <label> a </label>
          <input
            placeholder="dd/MM"
            type="text"
            value={finSemana}
            onChange={(e) => setFinSemana(e.target.value)}
          />
        </div>
        <div className="fecha">
          <label>Fecha</label>
          <input
            type="text"
            placeholder="Ej: Lunes 12"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
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
          <button onClick={manjearBotones}>Exportar</button>
          {mostrarBotones && (
            <div className="btnAux">
              <button onClick={handleSendEmail}>Email a Operarios</button>{" "}
              <button>Email a Ayuntamientos</button>
            </div>
          )}
        </div>
      </div>
      <div className="deseleccionar">
        <button onClick={() => unselectAll()}>Deseleccionar todos</button>
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
