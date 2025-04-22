const Inicio = () => {
  return (
    <div className="inicio">
      <div className="cuerpo">
        <div className="cuerpo__texto">
          <div className="creditos">
            <p>
              Aplicaciones creadas por <b>Antonio Vila</b> para el desarrollo de
              tareas repetitivas de manera mucho más rápida y práctica.
            </p>
            <p>
              El ingeniero responsable de estas aplicaciones es{" "}
              <b>Javier Álvarez</b>
            </p>
            <p>
              El responsable de la aplicación de Expropiaciones es{" "}
              <b>Enrique Maciñeira</b>
            </p>
          </div>
          <div className="descripciones">
            <ul className="descripciones__lista">
              <li>
                <b>Conversor Espiras-Gomas</b>: Esta aplicación sirve para
                convertir el archivo txt que se recibe a un archivo af1 que se
                necesita para los informe de aforos
              </li>
              <li>
                <b>Unificador sentidos</b>: Esta aplicación une los dos archivos
                de aforos, de un carril de ida y un carril de vuelta, en uno
                solo, con todos los datos
              </li>
              <li>
                <b>Listado de gomas</b>: Con esta herramienta podremos invertir
                el Excel que se envía desde la Xunta de su manera a una forma
                mucho más accesible y usable.
              </li>
              <li>
                <b>Accidentes DEPO</b>: Esta herramienta sirve para comparar dos
                excel con datos de los accidentes de la Diputación de Pontevedra
                y, exportar los Datos en un mismo Excel
              </li>
              <li>
                <b>Generador de emails - DEPO</b>: Esta herramienta sirve para
                generar los emails que se envían a las\los trabajadoras\es y a
                los Ayuntamientos sobre las gomas a instalar o retirar
              </li>
              <li>
                <b>Buscador de celdas</b>: Esta herramienta sirve para buscar el
                valor de la celda o las celdas que el usuario escriba separadas
                por comas y sacar un documento con estos valores
              </li>
              <li>
                <b>Festivos</b>: Esta herramienta sirve para consultar los
                festivos de cada ayuntamiento de la Comunididad Autónoma de
                Galicia. Además se consultan los festivos nacionales y los
                autonómicos
              </li>
              <li>
                <b>Conversor Excel a xml [Expropiaciones]</b>: Esta herramienta
                es una adaptación de código en Python que convierte un excel con
                una estructura exacta en un xml
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
