import React, { useState } from "react";
import "./ConcelloEmailManager.css";
import { useConcelloEmails } from "../Context/ConcelloEmailContext";

interface ConcelloEmail {
  concello: string;
  email: string;
  email2?: string;
  extra?: string;
}

const ConcelloEmailManager = () => {
  const { concellosEmails, setConcellosEmails } = useConcelloEmails();

  const [editingEmail, setEditingEmail] = useState<ConcelloEmail>({
    concello: "",
    email: "",
    email2: "",
    extra: "",
  });

  const handleSaveEmail = () => {
    if (!editingEmail.concello || !editingEmail.email) return;

    if (editingEmail.concello) {
      // Actualizar email existente
      const updatedEmails: ConcelloEmail[] = concellosEmails.map(
        (email: ConcelloEmail) =>
          email.concello === editingEmail.concello ? editingEmail : email
      );
      setConcellosEmails(updatedEmails);
    } else {
      // Añadir nuevo email
      const updatedEmails: ConcelloEmail[] = [...concellosEmails, editingEmail];
      setConcellosEmails(updatedEmails);
    }
    setEditingEmail({
      concello: "",
      email: "",
      email2: "",
      extra: "",
    });
  };

  const handleDeleteEmail = (concello: string) => {
    const updatedEmails: ConcelloEmail[] = concellosEmails.filter(
      (email: ConcelloEmail) => email.concello !== concello
    );
    setConcellosEmails(updatedEmails);
  };

  return (
    <div>
      <div className="concello">
        <div className="concello-form">
          <div className="form-group">
            <label htmlFor="concello">Concello</label>
            <input
              id="concello"
              type="text"
              value={editingEmail.concello}
              onChange={(e) =>
                setEditingEmail((prev) => ({
                  ...prev,
                  concello: e.target.value,
                }))
              }
              placeholder="Nombre del concello"
            />
            <small>Introduce el nombre del concello</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Principal</label>
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
              placeholder="ejemplo@ayuntamiento.es"
            />
            <small>Introduce el email principal</small>
          </div>

          <div className="form-group">
            <label htmlFor="email2">Email Secundario</label>
            <input
              id="email2"
              type="email"
              value={editingEmail.email2 || ""}
              onChange={(e) =>
                setEditingEmail((prev) => ({
                  ...prev,
                  email2: e.target.value,
                }))
              }
              placeholder="ejemplo2@ayuntamiento.es"
            />
            <small>Email secundario (opcional)</small>
          </div>

          <div className="form-group">
            <label htmlFor="extra">Email Extra</label>
            <input
              id="extra"
              type="email"
              value={editingEmail.extra || ""}
              onChange={(e) =>
                setEditingEmail((prev) => ({
                  ...prev,
                  extra: e.target.value,
                }))
              }
              placeholder="ejemplo3@ayuntamiento.es"
            />
            <small>Email extra (opcional)</small>
          </div>

          <div className="dialog-actions">
            <button
              onClick={() =>
                setEditingEmail({
                  concello: "",
                  email: "",
                  email2: "",
                  extra: "",
                })
              }
            >
              Cancelar
            </button>
            <button onClick={handleSaveEmail} className="save-button">
              {editingEmail.concello ? "Actualizar" : "Añadir"} Email
            </button>
          </div>
        </div>

        <div className="concello-list">
          <h3>Emails Actuales</h3>
          <ul>
            {concellosEmails.map((email) => (
              <li key={email.concello}>
                <div className="link-item">
                  <div className="link-info">
                    <strong>{email.concello}</strong>
                    <span>{email.email}</span>
                    {email.email2 && <span>{email.email2}</span>}
                    {email.extra && <span>{email.extra}</span>}
                  </div>
                  <button
                    className="edit-button"
                    onClick={() => setEditingEmail(email)}
                  >
                    Editar
                  </button>
                  <div className="deleteGroup">
                    <button onClick={() => handleDeleteEmail(email.concello)}>
                      x
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConcelloEmailManager;
