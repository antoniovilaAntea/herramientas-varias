import React, { useState } from "react";
import isEqual from "lodash/isEqual";
//VIGILAR CADA AÑO
import emails from "../Data/emailData";
import * as XLSX from "xlsx";
import Modal from "@mui/material/Modal";

import "./emailGenerator.css";
import { Box } from "@mui/material";

function EmailGenerator() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [instalar, setInstalar] = useState(false);
  const [retirar, setRetirar] = useState(false);
  const [inicioSemana, setInicioSemana] = useState<string>("");
  const [finSemana, setFinSemana] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [datos, setDatos] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);

  const handleInicioInputChange = (e: any) => {
    let value = e.target.value;
    if (value.length === 2 && !value.includes("/")) {
      value = value + "/";
    }
    setInicioSemana(value);
  };
  const handleFinInputChange = (e: any) => {
    let value = e.target.value;
    if (value.length === 2 && !value.includes("/")) {
      value = value + "/";
    }
    setFinSemana(value);
  };
  const handleCopyClick = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setIsCopied(true);
      alert("El cuerpo del mensaje se ha copiado en el portapapeles");

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const handleSendEmailConcellos = (e: any) => {
    handleOpenModal();
    const cuerpo = generarArchivoConcellos(datos);
    setEmailContent(cuerpo);
    handleCopyClick(cuerpo);
    const destinatarios = handleMostrarEmails();
    abrirCorreoConcellos(cuerpo, destinatarios);
  };
  const handleMostrarEmails = () => {
    let contenido: string[] = [];
    let emailsAgregados: any = {};

    datos.forEach((item) => {
      if (item.tipo === "Instalar") {
        item.selectedRows.forEach((selectedRow: any) => {
          const concello = selectedRow[3];
          const coincidencia = emails.find(
            (email) => email.concello.toUpperCase() === concello.toUpperCase()
          );

          if (coincidencia !== undefined) {
            const email = coincidencia.email;

            if (!emailsAgregados[email]) {
              contenido.push(email);
              emailsAgregados[email] = true;
            }

            if (
              coincidencia.email2 !== undefined &&
              !emailsAgregados[coincidencia.email2]
            ) {
              contenido.push(coincidencia.email2);
              emailsAgregados[coincidencia.email2] = true;
            }

            if (
              coincidencia.extra !== undefined &&
              !emailsAgregados[coincidencia.extra]
            ) {
              contenido.push(coincidencia.extra);
              emailsAgregados[coincidencia.extra] = true;
            }
          } else {
            console.log("NO HAY CONCELLOS");
          }
        });
      }
    });
    return contenido.join(",");
  };
  const abrirCorreoConcellos = (cuerpo: string, destinatarios: string) => {
    const subject = "Plan Aforos Deputación Pontevedra";
    const mailtoUrl = `mailto:${destinatarios}?subject=${subject}`;
    window.open(mailtoUrl);
  };

  const generarArchivoConcellos = (datos: any[]) => {
    let contenido =
      "Estimados,\n\n" +
      "No ámbito do contrato de Realización, Execución e Explotación do Plan de Aforos e do Estudo da Accidentalidade na Rede" +
      " de Estradas da Deputación Provincial de Pontevedra levado a cabo por Antea Group, informamos de que esta semana " +
      `(${datos[0].inicioSemana}/${new Date().getFullYear()} - ${datos[0].finSemana}/${new Date().getFullYear()})` +
      " instalaranse aforos vehiculares nas seguintes estradas provinciais:\n\n";

    const concellosMap: { [key: string]: string[] } = {};

    datos.forEach((item) => {
      if (item.tipo === "Instalar") {
        item.selectedRows.forEach((fila: any) => {
          const concello = fila[3];
          const fecha = item.fecha;
          const dato = `${fila[1]}, aproximadamente no PK ${
            fila[2]
          } (instalación prevista para o ${fecha.toLowerCase()})`;

          if (!concellosMap[concello]) {
            concellosMap[concello] = [];
          }

          concellosMap[concello].push(dato);
        });
      }
    });

    Object.keys(concellosMap).forEach((concello) => {
      contenido += `${concello.toUpperCase()}\n\n`;
      concellosMap[concello].forEach((dato) => {
        contenido += `  · ${dato}\n\n`;
      });
    });

    contenido +=
      "Cabe destacar que os aforos serán de unha semana completa (7 días completos dende a data de instalación). \n\n";
    contenido +=
      "Indicar que os equipos a instalar son simplemente contadores da intensidade do tráfico (vehículos) que circula " +
      "por cada vía ó longo do día, non son en ningún caso dispositivos radar. \n\n";
    contenido +=
      "Rogaríamos que tamén se puxese en coñecemento a policía local de cada concello da realización desta " +
      "campaña de aforos, co fin de que, dentro da medida do posible, inspeccionen as zonas afectadas para comprobar que non se realizou acto de vandalismo algún. \n\n";
    contenido +=
      "En caso de que exista algunha incidencia, solicitamos que o poñades en coñecemento da persoa responsable dos traballos:\n\n";
    contenido += "Javier: 647 95 12 05\n\n";
    contenido += "Quedamos a súa disposición ante calquera cuestión.\n\n";
    contenido += "Reciban un cordial saúdo.\n\n";

    contenido = contenido.replace(/\n/g, "\r\n");
    return contenido;
  };
  function formatNumber(value: number | string): string {
    const num = typeof value === "string" ? parseInt(value) : value;
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return `${thousands} + ${remainder.toString().padStart(3, "0")}`;
  }
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
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
        row[4] !== "PK" && row[4] !== undefined ? formatNumber(row[4]) : row[4],
        row[5],
        convertirFechaExcelANormal(row[11]),
        convertirFechaExcelANormal(row[12]),
      ]);
      setExcelData(filteredData);
    };

    reader.readAsBinaryString(file as Blob);
  };

  const handleRowClick = (row: any[]) => {
    if (selectedRows.some((selectedRow) => isEqual(selectedRow, row))) {
      setSelectedRows(
        selectedRows.filter((selectedRow) => !isEqual(selectedRow, row))
      );
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const convertirFechaExcelANormal = (numExcel: any) => {
    console.log(typeof numExcel);
    if (typeof numExcel === "number") {
      const fechaUTC = new Date((numExcel - 25569) * 86400000);

      const opciones: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      };

      return fechaUTC.toLocaleDateString("es-ES", opciones);
    } else {
      return numExcel;
    }
  };
  const handleSendEmailOperarios = () => {
    const emailBody = createEmailBodyOperarios(datos);
    const emails = createEmailsOperarios();
    enviarCorreo(emailBody, emails, datos);
  };

  const enviarCorreo = (cuerpo: string, destinatarios: string, data: any[]) => {
    const emailSubject = `PROGRAMACIÓN AFOROS DEPO ${new Date().getFullYear()}, SEMANA DEL ${data
      .map((e: any) => e.inicioSemana)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(", ")} AL ${data
      .map((e: any) => e.finSemana)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(", ")}:`;
    const mailtoLink = `mailto:${destinatarios}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoLink;
  };

  const createEmailBodyOperarios = (data: any[]): string => {
    let contenido = "";

    const groupedData: { [key: string]: any[][] } = {};
    data.forEach((item) => {
      const key = `${item.fecha}-${item.tipo}`;
      groupedData[key] = groupedData[key] || [];
      groupedData[key].push(...item.selectedRows);
    });

    let lastDate = "";
    Object.keys(groupedData).forEach((key, index) => {
      const [fecha, tipo] = key.split("-");
      if (fecha !== lastDate) {
        contenido += `${fecha.toUpperCase()}\n\n`;
        lastDate = fecha;
      }
      contenido += `Gomas a ${tipo.toUpperCase()}:\n`;

      groupedData[key].forEach((row: any) => {
        const codigo = row[1];
        const partes = row[2];
        const grupo = row[0];
        contenido += `• ${codigo}___PK ${partes} - Grupo: ${grupo}\n`;
      });

      contenido += index < Object.keys(groupedData).length - 1 ? "\n" : "";
    });
    driveLinks(data);
    contenido += "\n" + rutas.join("\n\n");

    return contenido;
  };

  const createEmailsOperarios = (): string => {
    return "alfonsomosquera@anteagroup.es,juanguerra@anteagroup.es";
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
        obj.inicioSemana === inicioSemana &&
        obj.finSemana === finSemana &&
        obj.fecha === fecha &&
        obj.tipo === tipo &&
        JSON.stringify(obj.selectedRows) === JSON.stringify(selectedRows)
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
        const grupo = row[0];
        if (!gruposUnicos.includes(grupo)) {
          gruposUnicos.push(grupo);
        }
      });
    });
    //MODIFICAR CADA AÑO
    // eslint-disable-next-line

    gruposUnicos.sort().map((letra) => {
      if (letra === "A") {
        rutas.push(
          "Enlaces Maps grupo A: https://www.google.com/maps/d/edit?mid=1Lfngolsi8wiIsczQa6OnonYIxz8Guqg&usp=sharing"
        );
      }
      if (letra === "B") {
        rutas.push(
          "Enlaces Maps grupo B: https://www.google.com/maps/d/edit?mid=1cMJNltX3wodTuX1juaEvjzjwBwoYbw4&usp=sharing"
        );
      }
      if (letra === "C") {
        rutas.push(
          "Enlaces Maps grupo C: https://www.google.com/maps/d/edit?mid=1NFFq_30N-wrJJxjgjdqVcQVBXC8RTl8&usp=sharing"
        );
      }
      if (letra === "D") {
        rutas.push("Enlaces Maps grupo D: ");
      }
      if (letra === "E") {
        rutas.push("Enlaces Maps grupo E: ");
      }
      if (letra === "F") {
        rutas.push("Enlaces Maps grupo F: ");
      }
      if (letra === "G") {
        rutas.push("Enlaces Maps grupo G: ");
      }
      if (letra === "H") {
        rutas.push("Enlaces Maps grupo H: ");
      }
      if (letra === "I") {
        rutas.push("Enlaces Maps grupo I: ");
      }
      // if (letra === "J") {
      //   rutas.push(
      //     "Enlaces Maps grupo J: "
      //   );
      // }
    });
  };
  //EMAILS
  return (
    <div className="email">
      <div className="email-importar">
        <label htmlFor="input-file">Selecciona Excel</label>
        <input
          id="input-file"
          type="file"
          accept=".xls, .xlsx, .xlsm"
          onChange={handleFileUpload}
        />
      </div>
      <div className="formulario">
        <div className="semana">
          <label htmlFor="de">Semana de </label>
          <input
            placeholder="dd/MM"
            maxLength={5}
            id="de"
            type="text"
            value={inicioSemana}
            onChange={handleInicioInputChange}
          />
          <label htmlFor="a"> a </label>
          <input
            id="a"
            placeholder="dd/MM"
            maxLength={5}
            type="text"
            value={finSemana}
            onChange={handleFinInputChange}
          />
        </div>
        <div className="fecha">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="text"
            id="fecha"
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
              <button onClick={handleSendEmailOperarios}>
                Email a Operarios
              </button>{" "}
              <button onClick={(e) => handleSendEmailConcellos(e)}>
                Email a Ayuntamientos
              </button>
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                className="modalMail"
              >
                <Box className="modalMail__texto">{emailContent}</Box>
              </Modal>
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
                <th key={excelData[index]}>{cell}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row: any[], rowIndex: number) => {
            const isRowEmpty = row.every((cell) => cell === undefined);
            if (!isRowEmpty) {
              return (
                <tr
                  key={excelData[rowIndex]}
                  onClick={() => handleRowClick(row)}
                  style={{
                    background: selectedRows.includes(row)
                      ? "lightblue"
                      : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={row[cellIndex]}>{cell}</td>
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
