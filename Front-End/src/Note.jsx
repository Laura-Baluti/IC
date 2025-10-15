import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Note.css";

const Note = () => {
  const [materii, setMaterii] = useState([]);
  const [materieSelectata, setMaterieSelectata] = useState(null);
  const [noteMaterie, setNoteMaterie] = useState([]);

  const [notaNoua, setNotaNoua] = useState("");
  const [descriereNoua, setDescriereNoua] = useState("");

  const [showAdaugaNotaModal, setShowAdaugaNotaModal] = useState(false);
  const [showStergeNotaModal, setShowStergeNotaModal] = useState(false);
  const [notaDeSters, setNotaDeSters] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/subjects/${userId}`)
        .then((res) => setMaterii(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId]);

  const handleSelectMaterie = (materie) => {
    setMaterieSelectata(materie);

    axios
      .get(`http://localhost:8080/grades/${userId}/${materie.subjectId}`)
      .then((res) => setNoteMaterie(res.data))
      .catch((err) => console.error(err));
  };

  const handleAdaugaNota = () => {
    if (!notaNoua.trim() || isNaN(parseFloat(notaNoua))) {
      alert("Introduceți o notă validă!");
      return;
    }

    const data = {
      value: parseFloat(notaNoua),
      description: descriereNoua || "Evaluare",
    };

    axios
      .post(`http://localhost:8080/grades/${userId}/${materieSelectata.subjectId}`, data)
      .then(() => {
        setNotaNoua("");
        setDescriereNoua("");
        setShowAdaugaNotaModal(false);
        return axios.get(`http://localhost:8080/grades/${userId}/${materieSelectata.subjectId}`);
      })
      .then((res) => setNoteMaterie(res.data))
      .catch((err) => console.error(err));
  };

  const handleStergeNota = () => {
    if (!notaDeSters.trim()) {
      alert("Introdu descrierea exactă a notei de șters!");
      return;
    }

    axios
      .delete(`http://localhost:8080/grades/${userId}/${materieSelectata.subjectId}/${notaDeSters}`)
      .then(() => {
        alert("Nota a fost ștearsă cu succes!");
        setShowStergeNotaModal(false);
        setNotaDeSters("");
        return axios.get(`http://localhost:8080/grades/${userId}/${materieSelectata.subjectId}`);
      })
      .then((res) => setNoteMaterie(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="note-container">
      {/* Sidebar */}
      <div className="sidebar2">
        <p className="section-title">Materiile tale</p>
        <hr className="separator" />
        <ul className="materii-lista">
          {materii.map((m) => (
            <li
              key={m.subjectId}
              className={`materie-item ${materieSelectata?.subjectId === m.subjectId ? "selectata" : ""}`}
              onClick={() => handleSelectMaterie(m)}
            >
              {m.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Conținut */}
      <div className="continut">
        {materieSelectata ? (
          <div>
            <h2>{materieSelectata.name}</h2>
            <div>
              <button
                className="adauga-nota-btn"
                onClick={() => setShowAdaugaNotaModal(true)}
              >
                + Adaugă notă
              </button>
              <button
                className="sterge-nota-btn"
                onClick={() => setShowStergeNotaModal(true)}
              >
                − Șterge notă
              </button>
            </div>

            <div className="lista-note">
              {noteMaterie.length > 0 ? (
                noteMaterie.map((n, i) => (
                  <div key={i} className="nota-card">
                    <div className="nota-valoare">{n.value}</div>
                    <div className="nota-descriere">{n.description}</div>
                    <div className="nota-data">
                      {new Date(n.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ marginTop: "20px", color: "#fff" }}>
                  Nu există note pentru această materie.
                </p>
              )}
            </div>
          </div>
        ) : (
          <h2>Selectează o materie din stânga</h2>
        )}
      </div>

      {/* Modal Adaugă */}
      {showAdaugaNotaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adaugă o notă</h3>
            <input
              type="number"
              step="0.01"
              placeholder="Nota (ex: 9.75)"
              value={notaNoua}
              onChange={(e) => setNotaNoua(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descriere (ex: Test 1)"
              value={descriereNoua}
              onChange={(e) => setDescriereNoua(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAdaugaNota} className="adauga">
                Adaugă
              </button>
              <button
                onClick={() => setShowAdaugaNotaModal(false)}
                className="cancel"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ștergere */}
      {showStergeNotaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Șterge o notă</h3>
            <input
              type="text"
              placeholder="Descrierea exactă (ex: Test 1)"
              value={notaDeSters}
              onChange={(e) => setNotaDeSters(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleStergeNota} className="sterge">
                Șterge
              </button>
              <button
                onClick={() => setShowStergeNotaModal(false)}
                className="cancel"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
