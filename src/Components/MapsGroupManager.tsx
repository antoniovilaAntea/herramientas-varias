import React, { useState, useEffect } from "react";
import "./MapsGroupManager.css";
import ConcelloEmailManager from "./ConcelloEmailManager";

interface MapsGroup {
  id: string;
  link: string;
}

interface Email {
  id: string;
  email: string;
}

interface CopyEmail {
  id: string;
  email: string;
}

const MapsGroupManager = () => {
  const [mapsLinks, setMapsLinks] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem("mapsLinks");
    return saved ? JSON.parse(saved) : {};
  });

  const [emails, setEmails] = useState<Email[]>(() => {
    const saved = localStorage.getItem("operariosEmails");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "1", email: "alfonsomosquera@anteagroup.es" },
          { id: "2", email: "juanguerra@anteagroup.es" },
        ];
  });

  const [copyEmails, setCopyEmails] = useState<CopyEmail[]>(() => {
    const saved = localStorage.getItem("copyEmails");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "1", email: "laurarey@anteagroup.es" },
          { id: "2", email: "mariadelmar.gonzalez@depo.es" },
        ];
  });

  const [openMaps, setOpenMaps] = useState(false);
  const toggleOpenMaps = () => {
    setOpenMaps(!openMaps);
  };
  const [openEmails, setOpenEmails] = useState(false);
  const toggleOpenEmails = () => {
    setOpenEmails(!openEmails);
  };
  const [openEmailsConcello, setOpenEmailsConcello] = useState(false);
  const toggleOpenEmailsConcello = () => {
    setOpenEmailsConcello(!openEmailsConcello);
  };
  const [openEmailsCopias, setOpenEmailsCopias] = useState(false);
  const toggleOpenEmailsCopias = () => {
    setOpenEmailsCopias(!openEmailsCopias);
  };
  const [editingGroup, setEditingGroup] = useState<MapsGroup>({
    id: "",
    link: "",
  });

  const [editingEmail, setEditingEmail] = useState<Email>({
    id: "",
    email: "",
  });

  const [editingCopyEmail, setEditingCopyEmail] = useState<CopyEmail>({
    id: "",
    email: "",
  });

  useEffect(() => {
    localStorage.setItem("mapsLinks", JSON.stringify(mapsLinks));
  }, [mapsLinks]);

  useEffect(() => {
    localStorage.setItem("operariosEmails", JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem("copyEmails", JSON.stringify(copyEmails));
  }, [copyEmails]);

  const handleSaveGroup = () => {
    if (!editingGroup.id || !editingGroup.link) {
      return;
    }

    const groupId = editingGroup.id.toUpperCase();
    setMapsLinks((prev) => ({
      ...prev,
      [groupId]: editingGroup.link,
    }));
    setEditingGroup({ id: "", link: "" });
  };

  const handleDeleteGroup = (groupId: string) => {
    const { [groupId]: deleted, ...remainingLinks } = mapsLinks;
    setMapsLinks(remainingLinks);
  };

  const handleCleanLink = (groupId: string) => {
    setMapsLinks((prev) => ({
      ...prev,
      [groupId]: "Sin enlace",
    }));
  };

  const handleSaveEmail = () => {
    if (!editingEmail.email) return;

    if (editingEmail.id) {
      setEmails((prev) =>
        prev.map((email) =>
          email.id === editingEmail.id ? editingEmail : email
        )
      );
    } else {
      setEmails((prev) => [
        ...prev,
        { ...editingEmail, id: Date.now().toString() },
      ]);
    }
    setEditingEmail({ id: "", email: "" });
  };

  const handleDeleteEmail = (id: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  const handleSaveCopyEmail = () => {
    if (!editingCopyEmail.email) return;

    if (editingCopyEmail.id) {
      setCopyEmails((prev) =>
        prev.map((email) =>
          email.id === editingCopyEmail.id ? editingCopyEmail : email
        )
      );
    } else {
      setCopyEmails((prev) => [
        ...prev,
        { ...editingCopyEmail, id: Date.now().toString() },
      ]);
    }
    setEditingCopyEmail({ id: "", email: "" });
  };

  const handleDeleteCopyEmail = (id: string) => {
    setCopyEmails((prev) => prev.filter((email) => email.id !== id));
  };

  return (
    <div className="maps-manager">
      <div onClick={() => toggleOpenMaps()} className="mapsTitle">
        {!openMaps && (
          <img
            alt="expandir"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          ></img>
        )}
        {openMaps && (
          <img
            style={{ transform: "rotate(180deg)" }}
            alt="contraer"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          ></img>
        )}
        <h2 style={{ marginLeft: "1em" }}>Gestionar Enlaces de Google Maps</h2>
      </div>

      {openMaps && (
        <>
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

            <div className="dialog-actions">
              <button onClick={() => setEditingGroup({ id: "", link: "" })}>
                Cancelar
              </button>
              <button onClick={handleSaveGroup} className="save-button">
                {editingGroup.id in mapsLinks ? "Actualizar" : "Añadir"} Grupo
              </button>
            </div>
          </div>

          <div className="maps-list">
            <h3>Enlaces Actuales</h3>
            <ul>
              {Object.entries(mapsLinks)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([id, link]) => (
                  <li key={id}>
                    <div className="link-item">
                      <div className="link-info">
                        <strong>Grupo {id}</strong>
                        <span className="link-url">{link || "Sin enlace"}</span>
                      </div>
                      <button
                        className="edit-button"
                        onClick={() => setEditingGroup({ id, link })}
                      >
                        Editar
                      </button>
                      <button
                        className="buttonLimpiar"
                        onClick={() => handleCleanLink(id)}
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
                        <button onClick={() => handleDeleteGroup(id)}>x</button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
      <div onClick={() => toggleOpenEmails()} className="mapsTitle">
        {!openEmails && (
          <img
            alt="expandir"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          ></img>
        )}
        {openEmails && (
          <img
            style={{ transform: "rotate(180deg)" }}
            alt="contraer"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          ></img>
        )}
        <h2 style={{ marginLeft: "1em" }}>Gestionar Emails de Operarios</h2>
      </div>
      {openEmails && (
        <>
          <div className="maps-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={editingEmail.email}
                onChange={(e) =>
                  setEditingEmail((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="ejemplo@anteagroup.es"
              />
              <small>Introduce el email del operario</small>
            </div>

            <div className="dialog-actions">
              <button onClick={() => setEditingEmail({ id: "", email: "" })}>
                Cancelar
              </button>
              <button onClick={handleSaveEmail} className="save-button">
                {editingEmail.id ? "Actualizar" : "Añadir"} Email
              </button>
            </div>
          </div>

          <div className="maps-list">
            <h3>Emails Actuales</h3>
            <ul>
              {emails.map((email) => (
                <li key={email.id}>
                  <div className="link-item">
                    <div className="link-info">
                      <span className="link-url">{email.email}</span>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => setEditingEmail(email)}
                    >
                      Editar
                    </button>
                    <div className="deleteGroup">
                      <button onClick={() => handleDeleteEmail(email.id)}>
                        x
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div onClick={() => toggleOpenEmailsConcello()} className="mapsTitle">
        {!openEmailsConcello && (
          <img
            alt="expandir"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          />
        )}
        {openEmailsConcello && (
          <img
            style={{ transform: "rotate(180deg)" }}
            alt="contraer"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          />
        )}
        <h2 style={{ marginLeft: "1em" }}>Gestionar Emails de Ayuntamientos</h2>
      </div>
      {openEmailsConcello && <ConcelloEmailManager />}
      <div onClick={() => toggleOpenEmailsCopias()} className="mapsTitle">
        {!openEmailsCopias && (
          <img
            alt="expandir"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          />
        )}
        {openEmailsCopias && (
          <img
            style={{ transform: "rotate(180deg)" }}
            alt="contraer"
            width={"15px"}
            height={"15px"}
            src={`${window.location.origin}${process.env.PUBLIC_URL}/flechaabajo.svg`}
          />
        )}
        <h2 style={{ marginLeft: "1em" }}>Gestionar Emails en Copia</h2>
      </div>
      {openEmailsCopias && (
        <>
          <div className="maps-form">
            <div className="form-group">
              <label htmlFor="copy-email">Email en Copia</label>
              <input
                id="copy-email"
                type="email"
                value={editingCopyEmail.email}
                onChange={(e) =>
                  setEditingCopyEmail((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="ejemplo@anteagroup.es"
              />
              <small>Introduce el email que recibirá copia</small>
            </div>

            <div className="dialog-actions">
              <button
                onClick={() => setEditingCopyEmail({ id: "", email: "" })}
              >
                Cancelar
              </button>
              <button onClick={handleSaveCopyEmail} className="save-button">
                {editingCopyEmail.id ? "Actualizar" : "Añadir"} Email
              </button>
            </div>
          </div>

          <div className="maps-list">
            <h3>Emails en Copia Actuales</h3>
            <ul>
              {copyEmails.map((email) => (
                <li key={email.id}>
                  <div className="link-item">
                    <div className="link-info">
                      <span className="link-url">{email.email}</span>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => setEditingCopyEmail(email)}
                    >
                      Editar
                    </button>
                    <div className="deleteGroup">
                      <button onClick={() => handleDeleteCopyEmail(email.id)}>
                        x
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MapsGroupManager;
