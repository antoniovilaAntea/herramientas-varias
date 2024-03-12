// Archivo: FileConverter.tsx
import { useState } from "react";
import { saveAs } from "file-saver";

type Props = {
  tipo: string;
};

const FileConverter = ({ tipo }: Props) => {
  const [archivoUno, setArchivoUno] = useState<File>();
  const [archivoDos, setArchivoDos] = useState<File>();

  const seleccionarArchivo1 = (event: any) => {
    const archivo = event.target.files[0];
    setArchivoUno(archivo);
  };
  const seleccionarArchivo2 = (event: any) => {
    const archivo = event.target.files[0];
    setArchivoDos(archivo);
  };

  const convertirDatos = (inputFile: File, outputFile: string) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const result = event.target.result as string;
        const lines = result.split("\n");
        const dataLines = lines.slice(1);
        const writer = [
          "Veh. No.;Date;Time;Lane;Axles;Spec;Class;Length (In Meters);Speed (In KPH);Gap (In Seconds);Follow (In Meters);Axle 1-2;Axle 2-3;Axle 3-4;Axle 4-5;Axle 5-6;Axle 6-7;Axle 7-8;Axle 8-9;Axle 9-10;Axle 10-11;Axle 11-12;Axle 12-13;Axle 13-14;Axle 14-15;Axle 15-16;;",
        ];
        let vehicleNumber = 1;

        dataLines.forEach((line) => {
          if (line.includes(";")) {
            const parts = line.split(",");
            if (parts.length === 6) {
              // Obtener datos
              const fechaHora = parts[0].trim();
              let carril = parseInt(parts[2].trim(), 10);
              if (carril === 1 || carril === 2) {
                carril = 1;
              }
              if (carril === 3 || carril === 4) {
                carril = 2;
              }
              const velocidad = parseInt(parts[3].trim(), 10);
              const longitud = (parseFloat(parts[4].trim()) / 100) * 0.696;

              // Separar fecha y hora
              const fechaHoraArray = fechaHora.split(" ");
              const fecha = fechaHoraArray[0];
              const hora = fechaHoraArray[1];

              // Escribir datos en el archivo de salida
              writer.push(
                `${vehicleNumber};${fecha};${hora};${carril};0;0;0;${longitud.toFixed(
                  5
                )};${velocidad};0;0,00;;;;;;;;;;;;;;;`
              );
              vehicleNumber++;
            }
          }
        });

        const blob = new Blob([writer.join("\n")], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, "ArchivoConvertidoDesdeTXT.af1");
      }
    };
    reader.readAsText(inputFile);
  };

  const unificarDatos = async (
    archivoEntrada1: File,
    archivoEntrada2: File
  ) => {
    try {
      let lineaDec = "";
      let lineaCre = "";
      let contadorLinea = 0;
      let error = false;
      let errorFechaMsg = "Error en la fecha de las líneas: ";
      let lineaVeloBaMeCre = "";
      let lineaVeloBaMeDec = "";
      let lineaVeloMeAlCre = "";
      let lineaVeloMeAlDec = "";
      let errorVelocidad = false;
      let errorVelocidadMsg = "";
      let contador = 0;
      let filaMayor = "";
      let contadorFilasDistintas = 0;

      leerArchivo(archivoEntrada1, archivoEntrada2);

      if (error) {
        alert(errorFechaMsg);
      }
      if (errorVelocidad) {
        alert(errorVelocidadMsg);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleFileChange = (e: any) => {
    tipo === "conversor"
      ? convertirDatos(e.target.files[0], "outputFile")
      : archivoUno
      ? archivoDos && unificarDatos(archivoUno, archivoDos)
      : alert("Falta el archivo creciente");
  };

  const leerArchivo = (archivo1: File, archivo2: File) => {
    const reader1 = new FileReader();
    const reader2 = new FileReader();
    let cont = 0;

    reader1.onload = function (e) {
      const contenidoArchivo1 = e.target?.result;

      reader2.onload = function (e) {
        const contenidoArchivo2 = e.target?.result;

        const lineasArchivo1 = contenidoArchivo1
          ? contenidoArchivo1.toString().split("\n")
          : [""];

        const contenidoFiltradoArchivo2 = contenidoArchivo2
          ?.toString()
          .split("\n")
          .filter((lin: string) =>
            lineasArchivo1?.some(
              (lineaArchivo1: any) =>
                !lin.includes("Informe".toUpperCase()) &&
                !lin.includes("Emplazamiento") &&
                !lin.includes("Bajas") &&
                !lin.includes("Altas") &&
                !lin.includes("Ligeros") &&
                !lin.includes("FECHA")
            )
          );

        const contenidoUnido = `${contenidoArchivo1}\n${contenidoFiltradoArchivo2?.join(
          "\n"
        )}`;

        // Crea un nuevo Blob con el contenido unido
        const blob = new Blob([contenidoUnido], {
          type: "text/plain;charset=utf-8",
        });

        // Descarga el Blob como archivo
        saveAs(blob, "ArchivoUnido.af1");

        console.log(contenidoUnido);
      };

      reader2.onerror = function (e) {
        console.error("Error al leer el segundo archivo:", e);
      };

      // Leer el segundo archivo como texto
      reader2.readAsText(archivo2);
      cont++;
    };

    reader1.onerror = function (e) {
      console.error("Error al leer el primer archivo:", e);
    };

    // Leer el primer archivo como texto
    reader1.readAsText(archivo1);
  };

  return (
    <>
      <div className="botones">
        <div className="archivo">
          <label className="input-group-text" htmlFor="inputGroupFile">
            {tipo === "conversor" ? "Examinar" : "Archivo Creciente"}
          </label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile"
            placeholder="Ningún archivo seleccionado"
            onChange={
              tipo === "unificador" ? seleccionarArchivo1 : handleFileChange
            }
          />
        </div>
        {tipo === "unificador" && (
          <div className="archivo2">
            <label className="input-group-text" htmlFor="inputGroupFile2">
              Archivo Decreciente
            </label>
            <input
              type="file"
              className="form-control"
              id="inputGroupFile2"
              placeholder="Ningún archivo seleccionado"
              onChange={seleccionarArchivo2}
            />
          </div>
        )}
      </div>
      {tipo === "unificador" && (
        <div className="boton-unir">
          <button onClick={handleFileChange}>Unir los dos archivos</button>
        </div>
      )}
    </>
  );
};

export default FileConverter;
