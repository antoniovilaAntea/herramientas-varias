import es from "date-fns/locale/es";
import React, { useCallback, useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import Select from "react-select";

import "./Festivos.css";
import Papa from "papaparse";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";

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
  const [selectedProvincias, setSelectedProvincias] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [filteredData, setFilteredData] = useState<HolidayData[]>([]);
  const [filtro, setFiltro] = useState("Municipio");

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

  const obtenerMunicipiosdeProvincia = useCallback(() => {
    const lugaresSeleccionados = selectedProvincias.map((opt) => opt.value);

    const minMaxRanges = lugaresSeleccionados.map((item) => {
      const [minStr, maxStr] = item.split("-");
      return {
        min: parseInt(minStr, 10),
        max: parseInt(maxStr, 10),
      };
    });

    const filtered = allData.filter((item) => {
      const enRango = minMaxRanges.some(
        (range) =>
          (item.id_municipio !== null &&
            Number(item.id_municipio) >= range.min &&
            Number(item.id_municipio) <= range.max) ||
          item.ambito === "autonómico" ||
          item.ambito === "estatal" ||
          item.ambito === "auton�mico"
      );

      const fechaItem = new Date(item.fecha);
      const fechaInicio = new Date(fecha[0].startDate);
      const fechaFin = new Date(fecha[0].endDate);

      return enRango && fechaItem >= fechaInicio && fechaItem <= fechaFin;
    });

    return filtered;
  }, [selectedProvincias, allData, fecha]);
  useEffect(() => {
    if (filtro === "Municipio") {
      setFilteredData(obtenerDatosFiltrados());
    } else {
      setFilteredData(obtenerMunicipiosdeProvincia());
    }
  }, [
    selectedOptions,
    selectedProvincias,
    allData,
    obtenerDatosFiltrados,
    obtenerMunicipiosdeProvincia,
    fecha,
  ]);

  const sortedData = [...filteredData].sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  );
  interface HolidayData {
    fecha: string;
    descripcion: string;
    ambito: string;
    id_municipio: number | "";
    lugar: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = localStorage.getItem("festivosData");
        if (savedData) {
          Papa.parse(savedData, {
            header: true,
            encoding: "UTF-8",
            complete: (result) => {
              const rawData = result.data as any[];
              processData(rawData);
            },
          });
          return;
        }
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
            processData(rawData);
          },
        });
      } catch (error) {
        console.error("Error cargando CSV:", error);
        setLoading(false);
      }
    };

    const processData = (rawData: any[]) => {
      const lugares = rawData.map((item) => item.lugar?.trim()).filter(Boolean);

      const lugaresUnicos = Array.from(new Set(lugares));

      const opciones = lugaresUnicos.map((lugar) => ({
        value: lugar,
        label: lugar,
      }));

      const datosCompletos: HolidayData[] = rawData.map((item) => ({
        fecha: String(item.fecha),
        descripcion: String(item.descripcion),
        ambito: String(item.ambito),
        id_municipio: item.id_municipio ?? Number(item.id_municipio),
        lugar: String(item.lugar).trim(),
      }));

      setAllData(datosCompletos);
      const opcionesOrdenadas = opciones.sort((a, b) =>
        a.label.localeCompare(b.label, "es", { sensitivity: "base" })
      );
      setOptions(opcionesOrdenadas);
      setLoading(false);
    };

    fetchData();
  }, []);
  const handleButtonClick = () => {
    setCalendarOpacity((prev) => (prev === 0 ? 1 : 0));
  };

  const handleMostrar = () => {
    setMostrar(true);
  };
  const handleChangeFiltro = (
    event: React.MouseEvent<HTMLElement>,
    newFiltro: string
  ) => {
    setFiltro(newFiltro);
    setSelectedOptions([]);
    setSelectedProvincias([]);
  };
  const control = {
    value: filtro,
    onChange: handleChangeFiltro,
    exclusive: true,
  };
  const provOmun = [
    <Tooltip title="Provincia" key="p">
      <ToggleButton className="imgFiltro" value={"Provincia"} key="prov">
        <img
          height={"40px"}
          width={"40px"}
          src={`${window.location.origin}${process.env.PUBLIC_URL}/ProvinciasGZ.png`}
          alt="Icono de provincias"
        ></img>
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Municipio" key="m">
      <ToggleButton className="imgFiltro" value={"Municipio"} key="mun">
        <img
          height={"40px"}
          width={"40px"}
          src={`${window.location.origin}${process.env.PUBLIC_URL}/ComarcasGZ.png`}
          alt="Icono de provincias"
        ></img>
      </ToggleButton>
    </Tooltip>,
  ];
  const provincias = [
    {
      value: "15000-15905",
      label: "A Coruña",
    },
    {
      value: "27000-27905",
      label: "Lugo",
    },
    {
      value: "32000-32100",
      label: "Ourense",
    },
    {
      value: "36000-36905",
      label: "Pontevedra",
    },
  ];
  return (
    <div className="festivos">
      <div className="festivos__form">
        <h3>Festivos locales</h3>
        <div>
          <ToggleButtonGroup {...control}>{provOmun}</ToggleButtonGroup>
        </div>
        <div className="festivos__form-selector">
          {filtro === "Municipio" && (
            <>
              <label htmlFor="mun">Municipio</label>
              <Select
                id="mun"
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
            </>
          )}
          {filtro === "Provincia" && (
            <>
              <label htmlFor="prov">Provincia</label>
              <Select
                id="prov"
                value={selectedProvincias}
                onChange={(newValue) => {
                  setSelectedProvincias(
                    newValue as Array<{ value: string; label: string }>
                  );
                  setMostrar(false);
                }}
                options={provincias}
                isLoading={loading}
                placeholder="Selecciona una provincia..."
                noOptionsMessage={() => "No hay opciones disponibles"}
                isClearable
                isSearchable
                isMulti
                closeMenuOnSelect={false}
              />
            </>
          )}
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
                  <div
                    key={
                      item.descripcion +
                      item.lugar +
                      item.fecha +
                      item.id_municipio
                    }
                  >
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
                  <div
                    key={
                      item.descripcion +
                      item.lugar +
                      item.fecha +
                      item.id_municipio
                    }
                  >
                    <p>{item.fecha.split("-").reverse().join("/")} </p>
                  </div>
                )
            )}
          </div>
          <div className="municipal">
            <h3>Municipal</h3>
            {filteredData.map(
              (item) =>
                item.ambito === "municipal" && (
                  <div
                    key={
                      item.descripcion +
                      item.lugar +
                      item.fecha +
                      item.id_municipio
                    }
                  >
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
