// Archivo: FileConverter.tsx
import React from "react";
import { saveAs } from "file-saver";

type Props = {
  tipo: string;
};

const FileConverter = ({ tipo }: Props) => {
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

  const unificarDatos = () => {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      tipo === "conversor"
        ? convertirDatos(selectedFile, "outputFile")
        : unificarDatos();
    }
  };

  return (
    <>
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
            onChange={handleFileChange}
          />
        </div>
        {tipo === "unificador" && (
          <div className="archivo2">
            <label className="input-group-text" htmlFor="inputGroupFile">
              Examinar
            </label>
            <input
              type="file"
              className="form-control"
              id="inputGroupFile"
              placeholder="Ningún archivo seleccionado"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      {tipo === "unificador" && (
        <div>
          <button>Unir los dos archivos</button>
        </div>
      )}
    </>
  );
};

export default FileConverter;
