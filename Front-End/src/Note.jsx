import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Note.css";

const Note = () => {
  const [materii, setMaterii] = useState([]);
  const [materieSelectata, setMaterieSelectata] = useState(null);
  const [noteMaterie, setNoteMaterie] = useState([]);
  const [showAdaugaNotaModal, setShowAdaugaNotaModal] = useState(false);
  const [showStergeNotaModal, setShowStergeNotaModal] = useState(false);
  const [notaNoua, setNotaNoua] = useState("");
  const [descriereNoua, setDescriereNoua] = useState("");
  const [descriereDeSters, setDescriereDeSters] = useState("");

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
    localStorage.setItem("subjectId", materie.subjectId);
    
    // Fetch grades for the selected subject
    axios
      .get(`http://localhost:8080/api/grades/${materie.subjectId}`)
      .then((res) => setNoteMaterie(res.data))
      .catch((err) => {
        console.error("Error fetching grades:", err);
        setNoteMaterie([]);
      });
  };

  // Load previously selected subject on component mount
  useEffect(() => {
    const savedSubjectId = localStorage.getItem("subjectId");
    if (savedSubjectId && materii.length > 0) {
      const savedMaterie = materii.find(m => m.subjectId === savedSubjectId);
      if (savedMaterie) {
        setMaterieSelectata(savedMaterie);
        // Fetch grades for the saved subject
        axios
          .get(`http://localhost:8080/api/grades/${savedSubjectId}`)
          .then((res) => setNoteMaterie(res.data))
          .catch((err) => {
            console.error("Error loading saved grades:", err);
            setNoteMaterie([]);
          });
      }
    }
  }, [materii]);

  const handleAdaugaNotaClick = () => {
    setShowAdaugaNotaModal(true);
  };

  const handleSaveGrade = async () => {
    if (!notaNoua.trim() || isNaN(parseFloat(notaNoua))) {
      alert("Introduceți o notă validă!");
      return;
    }
  
    const subjectId = localStorage.getItem("subjectId");
    if (!subjectId || !materieSelectata) {
      alert("Nu a fost selectată o materie!");
      return;
    }
  
    const gradeData = {
      value: parseFloat(notaNoua),
      description: descriereNoua || "Evaluare",
    };
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/grades/add/${subjectId}`,
        gradeData
      );
      
      if (response.data.success) {
        alert("Nota a fost adăugată cu succes!");
        setNotaNoua("");
        setDescriereNoua("");
        setShowAdaugaNotaModal(false);
        // Refetch grades after adding
        axios
          .get(`http://localhost:8080/api/grades/${subjectId}`)
          .then((res) => setNoteMaterie(res.data))
          .catch((err) => console.error("Error refetching grades:", err));
      }
    } catch (error) {
      console.error("Error adding grade:", error);
      alert("Eroare la adăugarea notei: " + (error.response?.data?.error || error.message));
    }
  };

  const handleStergeNotaClick = () => {
    if (!materieSelectata) {
      alert("Selectează mai întâi o materie!");
      return;
    }
    setShowStergeNotaModal(true);
  };

  const handleDeleteGrade = async () => {
    if (!descriereDeSters.trim()) {
      alert("Introdu descrierea exactă a notei de șters!");
      return;
    }

    const subjectId = localStorage.getItem("subjectId");
    if (!subjectId) {
      alert("Nu a fost selectată o materie!");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/grades/delete/${subjectId}/${encodeURIComponent(descriereDeSters)}`
      );
      
      if (response.data.success) {
        alert("Nota a fost ștearsă cu succes!");
        setDescriereDeSters("");
        setShowStergeNotaModal(false);
        // Refetch grades after deletion
        axios
          .get(`http://localhost:8080/api/grades/${subjectId}`)
          .then((res) => setNoteMaterie(res.data))
          .catch((err) => console.error("Error refetching grades:", err));
      }
    } catch (error) {
      console.error("Error deleting grade:", error);
      alert("Eroare la ștergerea notei: " + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseAdaugaModal = () => {
    setShowAdaugaNotaModal(false);
    setNotaNoua("");
    setDescriereNoua("");
  };

  const handleCloseStergeModal = () => {
    setShowStergeNotaModal(false);
    setDescriereDeSters("");
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
                onClick={handleAdaugaNotaClick}
              >
                + Adaugă notă
              </button>
              <button
                className="sterge-nota-btn"
                onClick={handleStergeNotaClick}
              >
                − Șterge notă
              </button>
            </div>
            {noteMaterie.length > 0 ? (
              <div style={{ marginTop: '20px' }}>
                <h3>Notele tale:</h3>
                <div className="lista-note">
                  {noteMaterie.map((n, i) => (
                    <div key={i} className="nota-card">
                      <div className="nota-valoare">{n.value}</div>
                      <div className="nota-descriere">{n.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ marginTop: "20px", color: "#fff" }}>
                Nu există note pentru această materie.
              </p>
            )}
          </div>
        ) : (
          <h2>Selectează o materie din stânga</h2>
        )}
      </div>

      {/* Modal for adding grade */}
      {showAdaugaNotaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adaugă o notă</h3>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="Nota (0-10)"
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
              <button onClick={handleSaveGrade} className="adauga">
                Adaugă
              </button>
              <button onClick={handleCloseAdaugaModal} className="cancel">
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for deleting grade */}
      {showStergeNotaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Șterge o notă</h3>
            <input
              type="text"
              placeholder="Descrierea exactă (ex: Test 1)"
              value={descriereDeSters}
              onChange={(e) => setDescriereDeSters(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleDeleteGrade} className="sterge">
                Șterge
              </button>
              <button onClick={handleCloseStergeModal} className="cancel">
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