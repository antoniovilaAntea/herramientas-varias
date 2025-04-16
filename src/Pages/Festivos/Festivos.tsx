import es from "date-fns/locale/es";
import React, { useCallback, useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import Select from "react-select";

import "./Festivos.css";
import Papa from "papaparse";

const Festivos = () => {
  const [calendarOpacity, setCalendarOpacity] = useState(0);
  const [fecha, setFecha] = useState([
    {
      startDate: new Date("1/1/2025"),
      endDate: new Date("12/31/2025"),
      key: "selection",
    },
  ]);
  const [options, setOptions] = useState<{ value: any; label: any }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [allData, setAllData] = useState<HolidayData[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [filteredData, setFilteredData] = useState<HolidayData[]>([]);

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const obtenerDatosFiltrados = useCallback(() => {
    const lugaresSeleccionados = selectedOptions.map((opt) => opt.value);
    const start = fecha[0].startDate;
    const end = fecha[0].endDate;

    return allData.filter((item) => {
      const [year, month, day] = item.fecha.split("-");
      const itemDate = new Date(+year, +month - 1, +day);

      const inDateRange = itemDate >= start && itemDate <= end;
      const inSelectedLugar =
        lugaresSeleccionados.length === 0 ||
        lugaresSeleccionados.includes(item.lugar.trim()) ||
        item.ambito === "autonómico" ||
        item.ambito === "estatal" ||
        item.ambito === "auton�mico";
      return inDateRange && inSelectedLugar;
    });
  }, [selectedOptions, allData, fecha]);

  useEffect(() => {
    setFilteredData(obtenerDatosFiltrados());
  }, [selectedOptions, allData, obtenerDatosFiltrados, fecha]);

  const sortedData = [...filteredData].sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  );
  interface HolidayData {
    fecha: string;
    descripcion: string;
    ambito: string;
    id_municipio: number | null | "";
    lugar: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}${process.env.PUBLIC_URL}/calendario_laboral_2025 (1).csv`
        );

        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder("UTF-8");
        const csvData = decoder.decode(buffer);

        Papa.parse(csvData, {
          header: true,
          encoding: "UTF-8",
          complete: (result) => {
            const rawData = result.data as any[];

            const lugares = rawData
              .map((item) => item.lugar?.trim())
              .filter(Boolean);

            const lugaresUnicos = Array.from(new Set(lugares));

            const opciones = lugaresUnicos.map((lugar) => ({
              value: lugar,
              label: lugar,
            }));

            const datosCompletos: HolidayData[] = rawData.map((item) => ({
              fecha: String(item.fecha),
              descripcion: String(item.descripcion),
              ambito: String(item.ambito),
              id_municipio: item.id_municipio
                ? Number(item.id_municipio)
                : null,
              lugar: String(item.lugar).trim(),
            }));

            setAllData(datosCompletos);
            const opcionesOrdenadas = opciones.sort((a, b) =>
              a.label.localeCompare(b.label, "es", { sensitivity: "base" })
            );
            setOptions(opcionesOrdenadas);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error cargando CSV:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleButtonClick = () => {
    setCalendarOpacity((prev) => (prev === 0 ? 1 : 0));
  };

  const handleMostrar = () => {
    setMostrar(true);
  };

  const provincias = [
    {
      min: 15000,
      max: 15905,
      provincia: "A Coruña",
    },
    {
      min: 27000,
      max: 27905,
      provincia: "Lugo",
    },
    {
      min: 32000,
      max: 32100,
      provincia: "Ourense",
    },
    {
      min: 36000,
      max: 36905,
      provincia: "Pontevedra",
    },
  ];
  return (
    <div className="festivos">
      <div className="festivos__form">
        <h3>Festivos locales</h3>
        <div className="festivos__form-selector">
          <label htmlFor="prov_mun">Municipio</label>
          <Select
            value={selectedOptions}
            onChange={(newValue) => {
              setSelectedOptions(
                newValue as Array<{ value: string; label: string }>
              );
              setMostrar(false);
            }}
            options={options.sort((a, b) => a.value - b.value)}
            isLoading={loading}
            placeholder="Selecciona un municipio..."
            noOptionsMessage={() => "No hay opciones disponibles"}
            isClearable
            isSearchable
            isMulti
            closeMenuOnSelect={false}
          />
        </div>
        <div className="boton-unir">
          <button onClick={handleButtonClick}>
            {fecha[0].startDate &&
            fecha[0].endDate &&
            fecha[0].startDate.toLocaleDateString() !==
              fecha[0].endDate.toLocaleDateString()
              ? `${fecha[0].startDate
                  .toLocaleDateString()
                  .replaceAll("/", ".")} - ${fecha[0].endDate
                  .toLocaleDateString()
                  .replaceAll("/", ".")}`
              : "Selecciona un rango de fecha"}
          </button>
        </div>
        <div
          className="festivos__form-fecha"
          style={{
            display: calendarOpacity === 0 ? "none" : "block",
            opacity: calendarOpacity,
          }}
        >
          <DateRange
            editableDateInputs={true}
            onChange={(item: RangeKeyDict) => {
              const selection = item.selection;
              setFecha([
                {
                  startDate: selection.startDate ?? new Date(),
                  endDate: selection.endDate ?? new Date(),
                  key: "selection",
                },
              ]);
              formatDate(fecha[0].startDate);
            }}
            moveRangeOnFirstSelection={false}
            ranges={fecha}
            showMonthAndYearPickers={false}
            weekStartsOn={1}
            rangeColors={["#395983"]}
            locale={es}
          />
        </div>
        <div className="festivos__form-boton">
          <button onClick={handleMostrar}>Mostrar festivos</button>
        </div>
      </div>
      {mostrar && (
        <div className="mostrar__festivos">
          <div className="estatal">
            <h3>Estatal</h3>
            {filteredData.map(
              (item) =>
                item.ambito === "estatal" && (
                  <div key={item.descripcion + item.lugar}>
                    <p>{item.fecha.split("-").reverse().join("/")} </p>
                  </div>
                )
            )}
          </div>
          <div className="autonomico">
            <h3>Autonómicos</h3>
            {filteredData.map(
              (item) =>
                item.ambito === "auton�mico" && (
                  <div key={item.descripcion + item.lugar}>
                    <p>{item.fecha.split("-").reverse().join("/")} </p>
                  </div>
                )
            )}
          </div>
          <div className="municipal">
            <h3>Municipal</h3>
            {filteredData.map(
              //si no quiere tener ordenado por ayto poner sortedData
              (item) =>
                item.ambito === "municipal" && (
                  <div key={item.descripcion + item.lugar}>
                    <p>
                      {item.fecha.split("-").reverse().join("/")}{" "}
                      {item.lugar ?? item.lugar}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Festivos;
