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
  const [subjectId, setSubjectId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAdaugaNotitaModal, setShowAdaugaNotitaModal] = useState(false);
  const [numeNotita, setNumeNotita] = useState("");
  const [fisierNotita, setFisierNotita] = useState(null);

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
        .then(() => {
          // După adăugare, facem iar GET ca să luăm toate materiile fresh
          axios.get(`http://localhost:8080/subjects/${userId}`)
            .then((response) => {
              setMaterii(response.data);
              setMaterieNoua("");
              setShowAdaugaModal(false);
            })
            .catch((error) => {
              console.error("Eroare la reîncărcarea materiilor: ", error);
            });
        })
        .catch((error) => {
          console.error("Eroare la adăugarea materiei: ", error);
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

  const handleSalveazaNotita = () => {
    if (!numeNotita.trim() || !fisierNotita) {
      alert("Completează numele notiței și selectează un fișier!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", numeNotita);
    formData.append("file", fisierNotita);
    formData.append("subjectId", subjectId); // presupunem că materia are id-ul ei
  
    axios.post(`http://localhost:8080/subjects/${userId}/${subjectId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      alert("Notița a fost adăugată cu succes!");
      setNumeNotita("");
      setFisierNotita(null);
      setShowAdaugaNotitaModal(false);
      // aici mai târziu putem face să actualizăm lista de notițe
    })
    .catch((error) => {
      console.error("Eroare la salvarea notiței: ", error);
      alert("A apărut o eroare. Încearcă din nou.");
    });
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
              onClick={() => {
                setMaterieSelectata(materie); // Set the selected subject
                const subjectId = materie.subjectId; // Access subjectId from the materie object
                setSubjectId(subjectId); // Set the materie ID
                localStorage.setItem('subjectId', subjectId);
                
                console.log("User ID:", userId);
                console.log("Selected Materie ID:", subjectId); // Log the subjectId (string)
              }}
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
              <div>
                
                  <button 
                    className="adauga-notita-btn" 
                    onClick={() => setShowAdaugaNotitaModal(true)}
                  >
                    + Adaugă notiță
                  </button>

              </div>
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
              <button onClick={handleAdauga} className="adauga">Adaugă</button>
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
              <button onClick={handleSterge} className="sterge">Șterge</button>
              <button onClick={() => setShowStergeModal(false)} className="cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}
    


    {showAdaugaNotitaModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Adaugă o notiță pentru {materieSelectata.name}</h3>
          <input
            type="text"
            placeholder="Numele notiței"
            value={numeNotita}
            onChange={(e) => setNumeNotita(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFisierNotita(e.target.files[0])}
          />
          <div className="modal-buttons">
            <button onClick={handleSalveazaNotita} className="adauga">Salvează</button>
            <button onClick={() => setShowAdaugaNotitaModal(false)} className="cancel">Anulează</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Notite;