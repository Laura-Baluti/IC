import React, { useState } from "react";
import './Notite.css';

const Notite = () => {
  const [materii, setMaterii] = useState(["Matematică", "Fizică"]);
  const [materieSelectata, setMaterieSelectata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [materieNoua, setMaterieNoua] = useState("");

  const handleAdauga = () => {
    if (materieNoua.trim()) {
      setMaterii([...materii, materieNoua]);
      setMaterieNoua("");
      setShowModal(false);
    }
  };

  return (
    <div className="notite-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Adaugă materie</button>
        <ul className="materii-lista">
          {materii.map((materie, index) => (
            <li
              key={index}
              className={`materie-item ${materie === materieSelectata ? 'selectata' : ''}`}
              onClick={() => setMaterieSelectata(materie)}
            >
              {materie}
            </li>
          ))}
        </ul>
      </div>

      {/* Conținut */}
      <div className="continut">
        {materieSelectata ? (
          <div>
            <h2>{materieSelectata}</h2>
            <p>Aici vor apărea notițele pentru această materie.</p>
          </div>
        ) : (
          <h2>Selectează o materie din stânga</h2>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
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
              <button onClick={() => setShowModal(false)} className="cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notite;
