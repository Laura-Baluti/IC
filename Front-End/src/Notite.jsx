import React, { useState, useEffect } from "react";
import axios from "axios"; 
import './Notite.css';

const Notite = () => {
  const [materii, setMaterii] = useState([]); // Lista de materii obținută de la backend
  const [materieSelectata, setMaterieSelectata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [materieNoua, setMaterieNoua] = useState("");
  const [userId, setUserId] = useState(null); // userId-ul de la login (va fi setat după autentificare)

  // Obține materiile pentru utilizatorul curent după login
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId"); // Get userId from localStorage
    if (savedUserId) {
      setUserId(savedUserId); // Set the userId state
    }
  }, []);

  // Obține materiile pentru utilizatorul curent după ce userId a fost setat
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    console.log("userId:", userId); // Log it to confirm it's correct

    if (userId) {
        // If userId exists, make the API call to get subjects for this user
        axios
            .get(`http://localhost:8080/subjects/${userId}`)
            .then((response) => {
                setMaterii(response.data); // Save the subjects in the component state
            })
            .catch((error) => {
                console.error("Eroare la obținerea materiilor: ", error);
            });
    }
}, []);

  // Funcția pentru adăugarea unei materii
  const handleAdauga = () => {
    if (materieNoua.trim()) {
        const subjectData = { name: materieNoua };
        console.log("Subject data being sent:", subjectData); // Log the subject data

        axios
            .post(`http://localhost:8080/subjects/${userId}`, subjectData)
            .then((response) => {
                setMaterii([...materii, response.data]); // Update the list of subjects
                setMaterieNoua(""); // Reset the input
                setShowModal(false); // Close the modal
            })
            .catch((error) => {
                console.error("Error adding subject: ", error.response ? error.response.data : error);
            });
    }
};

  return (
    <div className="notite-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Adaugă materie
        </button>
        <ul className="materii-lista">
          {materii.map((materie, index) => (
            <li
              key={index}
              className={`materie-item ${materie === materieSelectata ? 'selectata' : ''}`}
              onClick={() => setMaterieSelectata(materie)}
            >
              {materie.name} {/* Afișează numele materiei */}
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
