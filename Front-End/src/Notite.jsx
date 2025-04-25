import React, { useState, useEffect } from "react";
import axios from "axios"; 
import './Notite.css';

const Notite = () => {
  const [materii, setMaterii] = useState([]);
  const [materieSelectata, setMaterieSelectata] = useState(null);
  const [showAdaugaModal, setShowAdaugaModal] = useState(false);
  const [showStergeModal, setShowStergeModal] = useState(false);
  const [materieNoua, setMaterieNoua] = useState("");
  const [materieDeSters, setMaterieDeSters] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/subjects/${userId}`)
        .then((response) => {
          setMaterii(response.data);
        })
        .catch((error) => {
          console.error("Eroare la obținerea materiilor: ", error);
        });
    }
  }, []);

  const handleAdauga = () => {
    if (materieNoua.trim()) {
      const subjectData = { name: materieNoua };
      axios
        .post(`http://localhost:8080/subjects/${userId}`, subjectData)
        .then((response) => {
          setMaterii([...materii, response.data]);
          setMaterieNoua("");
          setShowAdaugaModal(false);
        })
        .catch((error) => {
          console.error("Error adding subject: ", error);
        });
    }
  };

  const handleSterge = () => {
    if (materieDeSters.trim()) {
      axios
        .delete(`http://localhost:8080/subjects/${userId}/${materieDeSters}`)
        .then(() => {
          setMaterii(materii.filter((m) => m.name !== materieDeSters));
          if (materieSelectata?.name === materieDeSters) {
            setMaterieSelectata(null);
          }
          setMaterieDeSters("");
          setShowStergeModal(false);
        })
        .catch((error) => {
          console.error("Eroare la ștergerea materiei: ", error);
        });
    }
  };

  return (
    <div className="notite-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="add-btn" onClick={() => setShowAdaugaModal(true)}>
          + Adaugă materie
        </button>

        {/* //Raul de aici*/}
        <button className="add-btn" onClick={() => setShowStergeModal(true)}> 
          − Șterge materie
        </button>
        <p className="section-title">Materiile tale</p>
        <hr className="separator" />
        {/* //Raul pana aici*/}

        <ul className="materii-lista">
          {materii.map((materie, index) => (
            <li
              key={index}
              className={`materie-item ${materie === materieSelectata ? 'selectata' : ''}`}
              onClick={() => setMaterieSelectata(materie)}
            >
              {materie.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Conținut */}
      <div className="continut">
        {materieSelectata ? (
          <div>
            <h2>{materieSelectata.name}</h2>
            <p>Aici vor apărea notițele pentru această materie.</p>
          </div>
        ) : (
          <h2>Selectează o materie din stânga</h2>
        )}
      </div>

      {/* Modal pentru Adăugare */}
      {showAdaugaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adaugă o nouă materie</h3>
            <input
              type="text"
              placeholder="Scrie aici numele materiei"
              value={materieNoua}
              onChange={(e) => setMaterieNoua(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAdauga}>Adaugă</button>
              <button onClick={() => setShowAdaugaModal(false)} className="cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pentru Ștergere */}
      {showStergeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Șterge o materie</h3>
            <input
              type="text"
              placeholder="Scrie aici numele materiei de șters"
              value={materieDeSters}
              onChange={(e) => setMaterieDeSters(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSterge}>Șterge</button>
              <button onClick={() => setShowStergeModal(false)} className="cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notite;
