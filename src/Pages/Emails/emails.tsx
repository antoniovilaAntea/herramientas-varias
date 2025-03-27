import EmailGenerator from "../../Components/EmailGenerator";

const Emails = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2em",
        }}
      >
        <h3>Descargar Generador Emails</h3>
        <a
          href="https://iceacsaconsultores-my.sharepoint.com/:u:/g/personal/antoniovila_anteagroup_es/ESCk61grpIdEiEc2t-woFiUB-OzdT8vCYsI3yH1ORRZ6wA?e=Rg2UpU"
          download={"Generador Emails"}
          target="_blank"
          rel="noreferrer"
        >
          <button>Descargar .zip</button>
        </a>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "2em",
        }}
      >
        <h3>Generar email - Dep. Pontevedra</h3>
        <EmailGenerator></EmailGenerator>
      </div>
    </>
  );
};

export default Emails;
