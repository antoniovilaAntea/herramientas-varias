import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import * as XLSX from "xlsx";
import isEqual from "lodash/isEqual";
import Notification from "./Notification";
//VIGILAR CADA AÑO
import "./emailGenerator.css";
import { useConcelloEmails } from "../Context/ConcelloEmailContext";

interface Email {
  id: string;
  email: string;
}

interface ConcelloEmail {
  concello: string;
  email: string;
  email2?: string;
  extra?: string;
}

function EmailGenerator() {
  const { concellosEmails, setConcellosEmails } = useConcelloEmails();
  const [excelData, setExcelData] = useState<any[]>([]);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [instalar, setInstalar] = useState(false);
  const [retirar, setRetirar] = useState(false);
  const [inicioSemana, setInicioSemana] = useState<string>("");
  const [finSemana, setFinSemana] = useState<string>("");
  const [fecha, setFecha] = useState<string>("Luns");
  const [datos, setDatos] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [numero, setNumero] = useState<number>();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const [openMapsDialog, setOpenMapsDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    link: string;
  }>({ id: "", link: "" });
  const [cleanGroup, setCleanGroup] = useState<{
    id: string;
    link: string;
  }>({ id: "", link: "" });
  const [deleteGroup, setDeleteGroup] = useState<{
    id: string;
    link: string;
  }>({ id: "", link: "" });

  const defaultMapsLinks: { [key: string]: string } = {
    A: "https://www.google.com/maps/d/edit?mid=1Lfngolsi8wiIsczQa6OnonYIxz8Guqg&usp=sharing",
    B: "https://www.google.com/maps/d/edit?mid=1cMJNltX3wodTuX1juaEvjzjwBwoYbw4&usp=sharing",
    C: "https://www.google.com/maps/d/edit?mid=1NFFq_30N-wrJJxjgjdqVcQVBXC8RTl8&usp=sharing",
    D: "https://www.google.com/maps/d/edit?mid=1DMQkj7jjlOuiHEJfK_U1eYQ34UoP07c&usp=sharing",
    E: "https://www.google.com/maps/d/edit?mid=19a8c3jai_gwTHhaM4zem-V1PZtq5Agw&usp=sharing",
    F: "",
    G: "",
    H: "",
    I: "https://www.google.com/maps/d/edit?mid=1dMh9U7unXndHyhOvoJzmOcSV77hGiQc&usp=sharing",
  };

  const [mapsLinks, setMapsLinks] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem("mapsLinks");
    return saved ? JSON.parse(saved) : defaultMapsLinks;
  });

  const [newConcelloEmail, setNewConcelloEmail] = useState<ConcelloEmail>({
    concello: "",
    email: "",
    email2: "",
    extra: "",
  });
  const [editingConcelloEmail, setEditingConcelloEmail] =
    useState<ConcelloEmail | null>(null);

  useEffect(() => {
    localStorage.setItem("mapsLinks", JSON.stringify(mapsLinks));
  }, [mapsLinks]);

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
      showNotification(
        "El cuerpo del mensaje se ha copiado en el portapapeles",
        "success"
      );
    } catch (err) {
      showNotification("Error al copiar el texto", "error");
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
    let emailsAgregados: { [key: string]: boolean } = {};

    datos.forEach((item) => {
      if (item.tipo === "Instalar") {
        item.selectedRows.forEach((selectedRow: any) => {
          const concello = selectedRow[3];
          const coincidencia = concellosEmails.find(
            (email) => email.concello?.toUpperCase() === concello.toUpperCase()
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
            showNotification(
              "No se encontró el concello en la base de datos",
              "warning"
            );
          }
        });
      }
    });
    return contenido.join(",");
  };
  const abrirCorreoConcellos = (cuerpo: string, destinatarios: string) => {
    const subject = "Plan Aforos Deputación Pontevedra";
    const copyEmails = JSON.parse(localStorage.getItem("copyEmails") || "[]");
    const copyEmailsString = copyEmails
      .map((email: { email: string }) => email.email)
      .join(",");
    const mailtoUrl = `mailto:${destinatarios}?cc=${copyEmailsString}&subject=${subject}`;
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
          const dia = item.numero;
          const dato = `${fila[1]}, aproximadamente no PK ${
            fila[2]
          } (instalación prevista para o ${fecha.toLowerCase()} ${dia})`;

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
      try {
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
            ? formatNumber(row[4])
            : row[4],
          row[5],
          convertirFechaExcelANormal(row[11]),
          convertirFechaExcelANormal(row[12]),
        ]);
        setExcelData(filteredData);
        showNotification("Archivo Excel cargado correctamente", "success");
      } catch (error) {
        showNotification("Error al cargar el archivo Excel", "error");
      }
    };

    reader.readAsArrayBuffer(file as Blob);
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
      const key = `${item.fecha}-${item.tipo}-${item.numero}`;
      groupedData[key] = groupedData[key] || [];
      groupedData[key].push(...item.selectedRows);
    });

    let lastDate = "";
    Object.keys(groupedData).forEach((key, index) => {
      const [fecha, tipo, dia] = key.split("-");
      if (fecha !== lastDate) {
        contenido += `${fecha.toUpperCase()} ${dia}\n\n`;
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
    const saved = localStorage.getItem("operariosEmails");
    const emails = saved ? JSON.parse(saved) : [];
    return emails.map((email: Email) => email.email).join(",");
  };
  const manjearBotones = () => {
    setMostrarBotones(!mostrarBotones);
  };

  const unselectAll = () => {
    setSelectedRows([]);
    showNotification("Todas las filas han sido deseleccionadas", "info");
  };

  const anadirDatos = () => {
    let tipo: string;
    if (instalar) {
      tipo = "Instalar";
    } else if (retirar) {
      tipo = "Retirar";
    } else {
      tipo = "No tipo";
    }
    if (
      selectedRows.length < 1 ||
      inicioSemana.length < 1 ||
      finSemana.length < 1 ||
      fecha === undefined ||
      numero === 0 ||
      numero === undefined ||
      tipo === "No tipo"
    ) {
      if (selectedRows.length < 1) {
        showNotification("No has seleccionado ninguna fila", "warning");
      }
      if (inicioSemana.length < 1) {
        showNotification("No has escrito inicio de la semana", "warning");
      }
      if (finSemana.length < 1) {
        showNotification("No has escrito fin de la semana", "warning");
      }
      if (fecha === undefined) {
        showNotification("No has seleccionado ningun día", "warning");
      }
      if (numero === 0 || numero === undefined) {
        showNotification("No has escrito número de día", "warning");
      }
      if (tipo === "No tipo") {
        showNotification(
          "No has seleccionado si es a instalar o a retirar",
          "warning"
        );
      }

      return true;
    } else {
      const hayDuplicadosEnDatos = datos.some(
        (obj) =>
          obj.inicioSemana === inicioSemana &&
          obj.finSemana === finSemana &&
          obj.fecha === fecha &&
          obj.tipo === tipo &&
          obj.numero === numero &&
          JSON.stringify(obj.selectedRows) === JSON.stringify(selectedRows)
      );
      if (!hayDuplicadosEnDatos) {
        setDatos([
          ...datos,
          { inicioSemana, finSemana, fecha, numero, tipo, selectedRows },
        ]);
        showNotification(
          `Se han añadido ${selectedRows.length} datos correctamente`,
          "success"
        );
      } else {
        showNotification("Ya existe un elemento igual", "warning");
      }

      return hayDuplicadosEnDatos;
    }
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

    gruposUnicos.forEach((letra) => {
      const link = mapsLinks[letra];
      if (link) {
        rutas.push(`Enlaces Maps grupo ${letra}: ${link}`);
      }
    });
  };

  const handleCloseMapsDialog = () => {
    setOpenMapsDialog(false);
    setEditingGroup({ id: "", link: "" });
  };

  const handleSaveMapsLink = () => {
    if (!editingGroup.id || !editingGroup.link) {
      showNotification("Todos los campos son obligatorios", "warning");
      return;
    }

    const groupId = editingGroup.id.toUpperCase();

    const newLinks = { ...mapsLinks, [groupId]: editingGroup.link };

    setMapsLinks(newLinks);
    showNotification("Enlace guardado correctamente", "success");
    handleCloseMapsDialog();
  };

  const getSortedGroups = () => {
    return Object.entries(mapsLinks)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, link]) => ({ id, link }));
  };

  const subirScroll = () => {
    if (dialogRef.current) {
      dialogRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        handleCloseMapsDialog();
      }
    };

    if (openMapsDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMapsDialog]);

  useEffect(() => {
    if (cleanGroup.id) {
      const groupId = cleanGroup.id.toUpperCase();
      const newLinks = { ...mapsLinks, [groupId]: "Sin enlace" };
      setMapsLinks(newLinks);
      showNotification("Enlace eliminado correctamente", "success");
    }
  }, [cleanGroup]);

  useEffect(() => {
    if (deleteGroup.id) {
      const { [deleteGroup.id]: deleted, ...remainingLinks } = mapsLinks;
      setMapsLinks(remainingLinks);
      showNotification("Grupo eliminado correctamente", "success");
    }
  }, [deleteGroup]);

  const handleSaveConcelloEmail = () => {
    if (!newConcelloEmail.concello || !newConcelloEmail.email) {
      showNotification("El concello y el email son obligatorios", "warning");
      return;
    }

    const concelloExists = concellosEmails.some(
      (email) =>
        email.concello.toLowerCase() === newConcelloEmail.concello.toLowerCase()
    );

    if (editingConcelloEmail) {
      const updatedEmails = concellosEmails.map((email) =>
        email.concello === editingConcelloEmail.concello
          ? newConcelloEmail
          : email
      );
      setConcellosEmails(updatedEmails);
      localStorage.setItem("concellosEmails", JSON.stringify(updatedEmails));
      setEditingConcelloEmail(null);
      showNotification("Email actualizado correctamente", "success");
    } else if (!concelloExists) {
      const updatedEmails = [...concellosEmails, newConcelloEmail];
      setConcellosEmails(updatedEmails);
      localStorage.setItem("concellosEmails", JSON.stringify(updatedEmails));
      showNotification("Email añadido correctamente", "success");
    } else {
      showNotification("Ya existe un concello con ese nombre", "warning");
      return;
    }

    setNewConcelloEmail({
      concello: "",
      email: "",
      email2: "",
      extra: "",
    });
  };

  const handleDeleteConcelloEmail = (concello: string) => {
    const updatedEmails = concellosEmails.filter(
      (email) => email.concello !== concello
    );
    setConcellosEmails(updatedEmails);
    localStorage.setItem("concellosEmails", JSON.stringify(updatedEmails));
  };

  const handleEditConcelloEmail = (email: ConcelloEmail) => {
    setEditingConcelloEmail(email);
    setNewConcelloEmail(email);
  };

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
      {/* <div className="linksmaps">
        <button className="maps-button" onClick={handleOpenMapsDialog}>
          Gestionar Enlaces Maps
        </button>
      </div> */}
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
          <select
            defaultValue={"Luns"}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            id="fecha"
          >
            <option value={"Luns"}>Luns</option>
            <option value={"Martes"}>Martes</option>
            <option value={"Mércores"}>Mércores</option>
            <option value={"Xoves"}>Xoves</option>
            <option value={"Venres"}>Venres</option>
          </select>
          <input
            type="number"
            placeholder="0"
            value={numero}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value >= 0 && value <= 31) {
                setNumero(value);
              }
            }}
            min={0}
            max={31}
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
                : showNotification("Datos añadidos correctamente", "success");
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
      {openMapsDialog && (
        <div className="maps-dialog">
          <div className="maps-dialog-content" ref={dialogRef}>
            <h2>Gestionar Enlaces de Google Maps</h2>
            <div className="maps-form">
              <div className="form-group">
                <label htmlFor="group-id">Grupo</label>
                <input
                  id="group-id"
                  type="text"
                  value={editingGroup.id}
                  onChange={(e) =>
                    setEditingGroup((prev) => ({
                      ...prev,
                      id: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Ej: A, B, C..."
                />
                <small>Introduce la letra del grupo</small>
              </div>
              <div className="form-group">
                <label htmlFor="maps-link">Enlace de Google Maps</label>
                <input
                  id="maps-link"
                  type="text"
                  value={editingGroup.link}
                  onChange={(e) =>
                    setEditingGroup((prev) => ({
                      ...prev,
                      link: e.target.value,
                    }))
                  }
                  placeholder="https://www.google.com/maps/d/edit?..."
                />
                <small>Pega el enlace completo de Google Maps</small>
              </div>
            </div>

            <div className="maps-list">
              <h3>Enlaces Actuales</h3>
              <ul>
                {getSortedGroups().map(({ id, link }) => (
                  <li key={id}>
                    <div className="link-item">
                      <div className="link-info">
                        <strong>Grupo {id}</strong>
                        <span className="link-url">{link || "Sin enlace"}</span>
                      </div>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditingGroup({ id, link });
                          setOpenMapsDialog(true);
                          setTimeout(() => {
                            subirScroll();
                          }, 50);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="buttonLimpiar"
                        onClick={() => {
                          setCleanGroup({ id, link });
                        }}
                      >
                        <img
                          className="imagenLimpiar"
                          alt="limpiar enlace"
                          height={"12px"}
                          width={"12px"}
                          src={`${window.location.origin}${process.env.PUBLIC_URL}/clean-svgrepo-com.svg`}
                        />
                      </button>
                      <div className="deleteGroup">
                        <button
                          onClick={() => {
                            setDeleteGroup({ id, link });
                          }}
                        >
                          x
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dialog-actions">
              <button onClick={handleCloseMapsDialog}>Cancelar</button>
              <button onClick={handleSaveMapsLink} className="save-button">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </div>
  );
}

export default EmailGenerator;
