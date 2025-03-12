import { useState } from "react";
import * as XLSX from "xlsx";
import { create } from "xmlbuilder2";
import { saveAs } from "file-saver";

const ExpropiacionesConverter = () => {
  const [archivo, setArchivo] = useState<File>();
  const [nombre, setNombre] = useState<string>("");
  const [presupuesto, setPresupuesto] = useState<string>("");
  const [xmlOutput, setXmlOutput] = useState<string | null>(null);
  const handleFileChange = (e: any) => {
    setArchivo(e.target.files[0]);
  };

  const handleNombreChange = (e: any) => {
    setNombre(e.target.value);
  };

  const handlePresupuestoChange = (e: any) => {
    setPresupuesto(e.target.value);
  };
  const toInteger = (value: any): string => {
    if (typeof value === "number") {
      return Number.isInteger(value)
        ? value.toString()
        : Math.round(value).toString();
    }
    const num = parseFloat(value);
    return isNaN(num)
      ? ""
      : Number.isInteger(num)
        ? num.toString()
        : Math.round(num).toString();
  };

  const toDecimal = (value: any): string => {
    const num = parseFloat(value);
    return isNaN(num) ? "0" : num.toString();
  };

  const formatoPersonalizado = (numero: any): string => {
    const numeroStr = numero.toString().replace(/\D/g, "");
    if (numeroStr.length === 0) return "";

    const ultimoDigito = numeroStr.slice(-1);
    const restoNumero = numeroStr.slice(0, -1).padStart(4, "0");
    return `${restoNumero}-${ultimoDigito}`;
  };

  const excelToCustomXML = (excelFile: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      //@ts-ignore
      const headerRow1: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      })[0];
      //@ts-ignore
      const headers: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      })[2];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        range: 4,
      });

      const root = create({ version: "1.0" }).ele("Anejo", {
        Nombre: nombre,
        Presupuesto: presupuesto,
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:noNamespaceSchemaLocation": "anejo.xsd",
      });

      jsonData.forEach((row: any) => {
        if (!row[headers.indexOf("UnidadOrganizativa")]) return;
        console.log(row);
        const finca = root.ele("Finca", {
          UnidadOrganizativa: row[headers.indexOf("UnidadOrganizativa")],
          N_orden: formatoPersonalizado(row[headers.indexOf("N_orden")]),
          Poligono: toInteger(row[headers.indexOf("Poligono")]),
          Parcela: toInteger(row[headers.indexOf("Parcela")]),
          Calificacion: toDecimal(row[headers.indexOf("Calificacion")]),
          Ref_catastral: row[headers.indexOf("Ref_catastral")],
          Municipio: toInteger(row[headers.indexOf("Municipio")]),
          Sup_catastral_total: row[headers.indexOf("Sup_catastral_total")],
          Margen: row[headers.indexOf("Margen")],
          Longitud_traza: toDecimal(row[headers.indexOf("Longitud_traza")]),
          PK_DESDE: toDecimal(row[headers.indexOf("PK_DESDE")]),
          PK_HASTA: toDecimal(row[headers.indexOf("PK_HASTA")]),
        });

        const codigoTipoIndex = headers.indexOf("CodigoTipoTerreno");
        finca.ele("Terreno", {
          CodigoTipoTerreno: toInteger(row[codigoTipoIndex]),
          Calificacion: row[codigoTipoIndex + 1],
          TipoOcupacion: toInteger(row[headers.indexOf("TipoOcupacion")]),
          Superficie: toDecimal(row[headers.indexOf("Superficie")]),
        });

        let titularCount = 0;
        let nombreColIndex = headers.findIndex((h) => h.includes("Nombre"));

        while (nombreColIndex >= 0 && titularCount < 4) {
          if (!row[nombreColIndex]) break;

          const titular = finca.ele("Titular", {
            Nombre: row[nombreColIndex],
            Apellido1: row[nombreColIndex + 1] || "",
            Apellido2: row[nombreColIndex + 2] || "",
          });

          const calleIndex = headers.findIndex(
            (h, idx) => idx >= nombreColIndex && h.includes("Calle")
          );

          if (calleIndex >= 0) {
            titular.ele("Domicilio", {
              Calle: row[calleIndex],
              Numero: toInteger(row[calleIndex + 1]),
              Piso: toInteger(row[calleIndex + 2]),
              Puerta: toInteger(row[calleIndex + 3]),
              CP: toInteger(row[calleIndex + 4]),
              Localidad: toInteger(row[calleIndex + 5]),
              ComunidadAutonoma: toInteger(row[calleIndex + 6]),
              Parroquia: toInteger(row[calleIndex + 7]),
              Municipio: toInteger(row[calleIndex + 8]),
              Provincia: toInteger(row[calleIndex + 9]),
              Pais: toInteger(row[calleIndex + 10]),
            });
          }

          nombreColIndex += 14;
          titularCount++;
        }

        const bienHeaders = headerRow1
          .map((h, idx) => (h.includes("Bien") ? idx : -1))
          .filter((idx) => idx !== -1);

        bienHeaders.forEach((bienIndex) => {
          const nombreBien = row[bienIndex];
          const cantidad = row[bienIndex + 1];
          const magnitud = row[bienIndex + 2];

          if (nombreBien || cantidad) {
            finca.ele("Bien", {
              Nombre: nombreBien,
              Cantidad: toInteger(cantidad),
              Magnitud: magnitud,
            });
          }
        });
      });

      const xmlString = root.end({ prettyPrint: true });
      setXmlOutput(xmlString);
      saveAs(new Blob([xmlString], { type: "application/xml" }), "salida.xml");
    };
    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className="botones__expropiar">
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
          accept=".xlsx"
        ></input>
      </div>
      <div className="inputs">
        <div className="inputs__nombre">
          <label htmlFor="nombre">Nombre proyecto</label>
          <input
            type="text"
            value={nombre}
            placeholder="Nombre"
            id="nombre"
            onChange={handleNombreChange}
          ></input>
        </div>
        <div className="inputs__presupuesto">
          <label htmlFor="presu">Presupuesto</label>
          <input
            type="number"
            placeholder="Presupuesto"
            id="presu"
            value={presupuesto}
            onChange={handlePresupuestoChange}
          ></input>
        </div>
      </div>
      <div className="convertir">
        <button onClick={() => archivo && excelToCustomXML(archivo)}>
          Convertir
        </button>
      </div>
    </div>
  );
};

export default ExpropiacionesConverter;
