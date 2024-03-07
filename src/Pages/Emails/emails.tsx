import React from "react";

const Emails = () => {
  return (
    <>
      <h3>Descargar Generador Emails</h3>
      <a
        href="/Emails_File/Creador de EmailS de gomas Pontevedra (tanto operarios como aytos).zip"
        download={"Generador Emails"}
        target="_blank"
        rel="noreferrer"
      >
        <button>Descargar .zip</button>
      </a>
    </>
  );
};

export default Emails;
