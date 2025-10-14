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
    const [fileId, setFileId] = useState(null);
    const [fastfileId, setFastfileId] = useState(null);

    const [showAdaugaNotitaModal, setShowAdaugaNotitaModal] = useState(false);
    const [fisierNotita, setFisierNotita] = useState(null);

    const [notiteMaterie, setNotiteMaterie] = useState([]);
    const [notiteRapide, setNotiteRapide] = useState([]);

    const [notitaVizibila, setNotitaVizibila] = useState(null);
    
    const [showStergeNotitaModal, setShowStergeNotitaModal] = useState(false);
    const [numeNotitaDeSters, setNumeNotitaDeSters] = useState("");

    const [notitaRapidaNoua, setNotitaRapidaNoua] = useState("");


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
            window.location.reload();
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
      if (!fisierNotita) {
        alert("Selectează un fișier!");
        return;
      }
    
      const formData = new FormData();
      formData.append("file", fisierNotita);
      formData.append("subjectId", subjectId); // presupunem că materia are id-ul ei
    
      axios.post(`http://localhost:8080/subjects/${userId}/${subjectId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        alert("Notița a fost adăugată cu succes!");

        axios.get(`http://localhost:8080/subjects/${userId}/${subjectId}`)
          .then((res) => {
            setNotiteMaterie(res.data); // Update notes state
          })
          .catch((err) => {
            console.error("Eroare la reîncărcarea notițelor:", err);
          });

        setFisierNotita(null);
        setShowAdaugaNotitaModal(false);
      })
      .catch((error) => {
        console.error("Eroare la salvarea notiței: ", error);
        alert("A apărut o eroare. Încearcă din nou.");
      });
    };

    //Notita rapida
    const handleSalveazaNotitaRapida = () => {
      if (!notitaRapidaNoua.trim()) {
        alert("Scrie ceva înainte de a salva.");
        return;
      }
    
      if (notitaRapidaNoua.length > 45) {
        alert("Notița rapidă nu poate depăși 45 de caractere.");
        return;
      }

      const fastFileData = {
        name: `Notita rapida ${new Date().toLocaleString()}`,
        content: notitaRapidaNoua
      };
    
      axios.post(`http://localhost:8080/fastfiles/${userId}/${subjectId}`, fastFileData, {
        headers: { "Content-Type": "application/json" }
      })
      .then((response) => {
        alert("Notița rapidă a fost salvată cu succes!");
        setNotitaRapidaNoua("");
    
        axios.get(`http://localhost:8080/fastfiles/${userId}/${subjectId}`)
          .then(res => {
            setNotiteRapide(res.data); 
          })
          .catch(err => console.error("Eroare la reîncărcarea notițelor rapide:", err));
      })
      .catch((error) => {
        console.error("Eroare la salvarea notiței rapide: ", error);
        alert("A apărut o eroare la salvarea notiței rapide.");
      });

    };

    const handleStergeNotitaRapidaById = () => {
      const id = localStorage.getItem("fastfileId"); // îl iei din localStorage
    
      if (!id) {
        alert("ID-ul notiței rapide nu este setat!");
        return;
      }
    
      if (!window.confirm("Sigur vrei să ștergi această notiță rapidă?")) return;
    
      axios
        .delete(`http://localhost:8080/fastfiles/${userId}/${subjectId}/delete/${id}`)
        .then(() => {
          alert("Notița rapidă a fost ștearsă cu succes!");
          setNotitaVizibila(null);
    
          // Reîncarcă lista
          axios
            .get(`http://localhost:8080/fastfiles/${userId}/${subjectId}`)
            .then(res => setNotiteRapide(res.data))
            .catch(err => console.error("Eroare la reîncărcarea notițelor rapide:", err));
        })
        .catch(err => {
          console.error("Eroare la ștergerea notiței rapide:", err);
          alert("Nu s-a putut șterge notița rapidă.");
        });
    };    

    
  //-------  

    const handleStergeNotita = () => {
      if (!numeNotitaDeSters.trim()) {
        alert("Introdu numele notiței de șters.");
        return;
      }
    
      axios
        .delete(`http://localhost:8080/subjects/${userId}/${subjectId}/${numeNotitaDeSters}`)
        .then(() => {
          alert("Notița a fost ștearsă cu succes!");
          // Refetch updated list
          return axios.get(`http://localhost:8080/subjects/${userId}/${subjectId}`);
        })
        .then((res) => {
          setNotiteMaterie(res.data);
          setNumeNotitaDeSters("");
          setShowStergeNotitaModal(false);
        })
        .catch((error) => {
          console.error("Eroare la ștergerea notiței:", error);
          alert("Nu s-a putut șterge notița.");
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

                  //Notite
                  axios.get(`http://localhost:8080/subjects/${userId}/${subjectId}`)
                  .then((res) => {
                    setNotiteMaterie(res.data);
                  })
                  .catch((err) => {
                    console.error("Eroare la încărcarea notițelor:", err);
                  });

                  //Notite rapide
                  axios.get(`http://localhost:8080/fastfiles/${userId}/${subjectId}`)
                  .then((res) => {
                    setNotiteRapide(res.data);
                  })
                  .catch((err) => {
                    console.error("Eroare la încărcarea notițelor rapide:", err);
                  });


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

                    <button 
                      className="sterge-notita-btn" 
                      onClick={() => setShowStergeNotitaModal(true)}
                    >
                      − Șterge notiță
                    </button>
                </div>

                {/* Notita rapida */}
                <div className="notita-rapida-container">
                  <textarea
                    className="textbox-notitaRapida"
                    placeholder="Scrie notița ta rapidă (max. 45 caractere):"
                    value={notitaRapidaNoua}
                    onChange={(e) => setNotitaRapidaNoua(e.target.value)}
                    maxLength={45}   // 45 caractere maxim
                  />
                  <p style={{ textAlign: 'right', fontSize: '12px', color: '#555' }}>
                    {notitaRapidaNoua.length}/45 caractere
                  </p>
                  <button 
                    className="notitaRapida-btn"
                    onClick={handleSalveazaNotitaRapida}
                  >
                  + Salvează notița rapidă
                  </button>
                </div>
            </div>
          ) : (
            <h2>Selectează o materie din stânga</h2>
          )}
          {notiteMaterie.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Notițele tale:</h3>
              {notiteMaterie.map((notita, i) => (
                <button
                  key={i}
                  className="notita-btn"
                  onClick={() => {
                    setNotitaVizibila(notita);
                    setFileId(notita.fileId);
                    localStorage.setItem('fileId', notita.fileId);
                    console.log("File ID:", notita.fileId);
                  }}
                  style={{ margin: '10px', padding: '10px', cursor: 'pointer' }}
                >
                  {notita.name}
                </button>
              ))}

              {notiteRapide.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                  <h3>Notițele tale rapide:</h3>
                  {notiteRapide.map((fast, i) => (
                    <button
                      key={i}
                      className="notita-btn"
                      onClick={() => {

                        setFastfileId(fast.id);
                        localStorage.setItem('fastfileId', fast.id);

                        axios
                          .get(`http://localhost:8080/fastfiles/${userId}/${subjectId}/download/${fast.id}`)
                          .then((res) => {
                            setNotitaVizibila({
                              name: fast.name,
                              content: res.data,
                              type: 'fast'
                            });
                          })
                          .catch(() => alert('Nu s-a putut încărca notița rapidă.'));
                      }}
                      style={{ margin: '10px', padding: '10px', cursor: 'pointer' }}
                    >
                      {fast.name}
                    </button>
                  ))}

                </div>
              )}


            </div>
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
      
      {notitaVizibila && (
    <div className="modal-overlay" onClick={() => setNotitaVizibila(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{notitaVizibila.name}</h3>

        {notitaVizibila.type === 'fast' ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', margin: '10px 0' }}>
            {notitaVizibila.content}
          </div>
        ) : (
          <a
            href={`http://localhost:8080/subjects/${userId}/${subjectId}/download/${fileId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="adauga-notita-btn"
          >
            Deschide notița
          </a>
        )}

        <div className="modal-buttons">
          {notitaVizibila.type === 'fast' && (
            <button
              onClick={handleStergeNotitaRapidaById}
              className="sterge-notitaRapida-btn"
            >
              Șterge
            </button>
          )}

          <button onClick={() => setNotitaVizibila(null)} className="cancel">
            Închide
          </button>
        </div>

      </div>
    </div>
  )}



      {showAdaugaNotitaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adaugă o notiță pentru {materieSelectata.name}</h3>
            
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

      {showStergeNotitaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Șterge notiță din {materieSelectata.name}</h3>
            <input
              type="text"
              placeholder="Numele fișierului exact (ex: notita.pdf)"
              value={numeNotitaDeSters}
              onChange={(e) => setNumeNotitaDeSters(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleStergeNotita} className="sterge">Șterge</button>
              <button onClick={() => setShowStergeNotitaModal(false)} className="cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };

  export default Notite;