// import React, { useState } from "react";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { DateRange, DateRangePicker } from "react-date-range";
// import { Cell, Row, Workbook } from "exceljs";

// const ExcelComparator = () => {
//   const [archivoUno, setArchivoUno] = useState<File>();
//   const [archivoDos, setArchivoDos] = useState<File>();
//   const [calendarOpacity, setCalendarOpacity] = useState(0);
//   const [datosConProvincial, setDatosConProvincial] = useState([]);
//   const [datosCoincidentes, setDatosCoincidentes] = useState([]);
//   const [datosAnteriores, setDatosAnteriores] = useState([]);
//   const [primeraFila, setPrimeraFila] = useState([]);
//   const [state, setState] = useState<any>([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);
//   const [click, setClick] = useState(false);

//   const handleButtonClick = () => {
//     setClick(!click);
//     setCalendarOpacity(click ? 0 : 1);
//   };
//   const seleccionarArchivo1 = (event: any) => {
//     const archivo = event.target.files[0];
//     setArchivoUno(archivo);
//   };
//   const seleccionarArchivo2 = (event: any) => {
//     const archivo = event.target.files[0];
//     setArchivoDos(archivo);
//   };

//   const btnExportarClick = async () => {
//     try {
//       await verificarDatos();
//     } catch (error) {
//       console.error(error);
//     }

//     const workbook = XLSX.utils.book_new();
//     const sheet1 = XLSX.utils.aoa_to_sheet(datosConProvincial);
//     const sheet2 = XLSX.utils.aoa_to_sheet(datosCoincidentes);
//     const sheet3 = XLSX.utils.aoa_to_sheet(datosAnteriores);

//     XLSX.utils.book_append_sheet(workbook, sheet1, "Todos");
//     XLSX.utils.book_append_sheet(
//       workbook,
//       sheet2,
//       `${state[0].startDate
//         .toLocaleDateString()
//         .replaceAll("/", ".")} - ${state[0].endDate
//         .toLocaleDateString()
//         .replaceAll("/", ".")}`
//     );
//     XLSX.utils.book_append_sheet(
//       workbook,
//       sheet3,
//       "Anteriores al " +
//         state[0].startDate.toLocaleDateString().replaceAll("/", ".")
//     );

//     // Ajustar anchos de columnas (implementa la función adjustColumnWidth)
//     // adjustColumnWidth(sheet1);
//     // adjustColumnWidth(sheet2);
//     // adjustColumnWidth(sheet3);

//     const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

//     saveAs(
//       new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
//       "output.xlsx"
//     );
//   };

//   const verificarDatos = async () => {
//     try {
//       const workbook1 = new Workbook();
//       const workbook2 = new Workbook();

//       const sheet1 = workbook1.getWorksheet(1);
//       const sheet2 = workbook2.getWorksheet(1);
//       if (sheet1 && sheet2) {
//         sheet1.eachRow(async (row1: Row, rowNum: number) => {
//           if (rowNum === 1) {
//             const primera: string[] = [];
//             row1.eachCell((cell: Cell) => {
//               primera.push(obtenerValorCelda(cell));
//             });
//             setPrimeraFila((prevPrimeraFila) => [...prevPrimeraFila, primera]);
//             return;
//           }

//           const cell10: Cell = row1.getCell(11);
//           const cell11: Cell = row1.getCell(12);
//           const fechaCell: Cell = row1.getCell(1);

//           let contieneProvincial: boolean = false;

//           if (
//             cell10 &&
//             cell10.type === CellType.String &&
//             cell10.value.toString().includes("Provincial")
//           ) {
//             contieneProvincial = true;
//           } else if (
//             cell11 &&
//             cell11.type === CellType.String &&
//             cell11.value.toString().includes("Provincial")
//           ) {
//             contieneProvincial = true;
//           }

//           if (contieneProvincial && fechaCell) {
//             const fecha: Date = fechaCell.value as Date;
//             if (fecha > fechaMinima && fecha < fechaMaxima) {
//               let encontrado: boolean = false;
//               const valorColumna1: string = row1
//                 .getCell(1)
//                 .value.toString()
//                 .trim();
//               sheet2.eachRow((row2: Row) => {
//                 const valorColumna2: string = row2
//                   .getCell(1)
//                   .value.toString()
//                   .trim();
//                 if (valorColumna2 === valorColumna1) {
//                   encontrado = true;
//                 }
//               });

//               if (!encontrado) {
//                 const datosrango: string[] = [];
//                 row1.eachCell((cell: Cell) => {
//                   datosrango.push(obtenerValorCelda(cell));
//                 });
//                 setDatosCoincidentes((prevDatosCoincidentes) => [
//                   ...prevDatosCoincidentes,
//                   datosrango,
//                 ]);
//               }
//             } else if (fecha < fechaMinima) {
//               const datosanteriores: string[] = [];
//               row1.eachCell((cell: Cell) => {
//                 datosanteriores.push(obtenerValorCelda(cell));
//               });

//               let encontrado: boolean = false;
//               sheet2.eachRow((row2: Row) => {
//                 const valorColumna2: string = row2
//                   .getCell(1)
//                   .value.toString()
//                   .trim();
//                 if (valorColumna2 === valorColumna1) {
//                   encontrado = true;
//                 }
//               });
//               if (!encontrado) {
//                 setDatosAnteriores((prevDatosAnteriores) => [
//                   ...prevDatosAnteriores,
//                   datosanteriores,
//                 ]);
//               }
//             }
//           }

//           if (contieneProvincial) {
//             const datos: string[] = [];
//             row1.eachCell((cell: Cell) => {
//               datos.push(obtenerValorCelda(cell));
//             });
//             setDatosConProvincial((prevDatosConProvincial) => [
//               ...prevDatosConProvincial,
//               datos,
//             ]);
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Error al leer archivos:", error);
//     }
//   };

//   // const abrirArchivoComoWorkbook = async (archivo: File): Promise<Workbook> => {
//   //   // Implementa la lógica para abrir el archivo y devolver un objeto Workbook
//   //   return {} as XLSX.WorkBook; // Solo un placeholder, reemplaza esto con la lógica real
//   // };

//   const obtenerValorCelda = (cell: Cell): string => {
//     switch (cell.type) {
//       case CellType.String:
//         return cell.value.toString();
//       case CellType.Number:
//         if (DateUtil.isDate(cell)) {
//           const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
//             "en-US",
//             {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//             }
//           );
//           return dateFormat.format(cell.value as Date);
//         } else {
//           return cell.value.toString();
//         }
//       case CellType.Boolean:
//         return cell.value.toString();
//       default:
//         return "";
//     }
//   };

//   const s2ab = (s: any) => {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
//     return buf;
//   };

//   return (
//     <div className="comparar">
//       <div className="boton-unir">
//         <button onClick={handleButtonClick}>
//           {state[0].startDate &&
//           state[0].endDate &&
//           state[0].startDate.toLocaleDateString() !==
//             state[0].endDate.toLocaleDateString()
//             ? `${state[0].startDate
//                 .toLocaleDateString()
//                 .replaceAll("/", ".")} - ${state[0].endDate
//                 .toLocaleDateString()
//                 .replaceAll("/", ".")}`
//             : "Selecciona un rango de fecha"}
//         </button>
//       </div>

//       <div
//         className={"calendar"}
//         style={{
//           display: calendarOpacity === 0 ? "none" : "",
//           opacity: calendarOpacity,
//         }}
//       >
//         <DateRange
//           editableDateInputs={true}
//           onChange={(item) => {
//             setState([item.selection]);
//           }}
//           moveRangeOnFirstSelection={false}
//           ranges={state}
//           showMonthAndYearPickers={false}
//           weekStartsOn={1}
//           rangeColors={["#4a6fa5ff"]}
//         />
//       </div>

//       <div className="botones">
//         <div className="archivo">
//           <label className="input-group-text" htmlFor="inputGroupFile">
//             Examinar
//           </label>
//           <input
//             type="file"
//             className="form-control"
//             id="inputGroupFile"
//             placeholder="Ningún archivo seleccionado"
//             onChange={seleccionarArchivo1}
//           />
//         </div>

//         <div className="archivo2">
//           <label className="input-group-text" htmlFor="inputGroupFile2">
//             Examinar
//           </label>
//           <input
//             type="file"
//             className="form-control"
//             id="inputGroupFile2"
//             placeholder="Ningún archivo seleccionado"
//             onChange={seleccionarArchivo2}
//           />
//         </div>
//       </div>
//       <div className="boton-unir">
//         <button onClick={btnExportarClick}>Exportar Excel</button>
//       </div>
//     </div>
//   );
// };

// export default ExcelComparator;

///CODIGO A BORRAR
const ExcelComparator = () => {
  return (
    <div className="comparador">
      <div className="descarga">
        <h3>Descargar Comparador</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/EcwA5OSrQR9IlMs5s4qc_1YBX2_Y7IKUqn2fEswMw8CEtw?e=bVFLED"
          download={"Comparador de celdas"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div className="texto">
        <h3>Comparar dos excel y exportarlos en un mismo excel</h3>
        {/* <ExcelComparator></ExcelComparator> */}
      </div>
    </div>
  );
};

export default ExcelComparator;
