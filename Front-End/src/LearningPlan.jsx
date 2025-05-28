import React, { useState, useEffect } from "react";
import axios from "axios";
import './LearningPlan.css';

const LearningPlan = () => {
  const [materii, setMaterii] = useState([]);
  const [notite, setNotite] = useState([]);
  const [materieSelectata, setMaterieSelectata] = useState("");
  const [notitaSelectata, setNotitaSelectata] = useState("");
  const [intrebare, setIntrebare] = useState("");
  const [raspuns, setRaspuns] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/subjects/${userId}`)
        .then((res) => setMaterii(res.data))
        .catch(err => console.error("Eroare materii:", err));
    }
  }, [userId]);

  
  const handleSelectMaterie = (materie) => {
    setMaterieSelectata(materie);
    axios.get(`http://localhost:8080/notes/${materie.subjectId}`)
      .then((res) => setNotite(res.data))
      .catch(err => console.error("Eroare notițe:", err));
  };
  

  const handleTrimite = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/ai/question', {
        question: intrebare,
        subject: materieSelectata.name,
        note: notitaSelectata
      });
      setRaspuns(response.data.answer);
    } catch (error) {
      console.error("Eroare AI:", error);
      setRaspuns("A apărut o eroare.");
    }
    setLoading(false);
  };

  return (
    <div className="learning-plan-container">
      <h2>SELECTEAZA NOTITA DORITA SI CREEAZA TESTUL TAU PERSONALIZAT!</h2>

      <div className="dropdowns">
        <select onChange={(e) => handleSelectMaterie(JSON.parse(e.target.value))}>
          <option value="">Selectează o materie</option>
          {materii.map((materie, index) => (
            <option key={index} value={JSON.stringify(materie)}>
              {materie.name}
            </option>
          ))}
        </select>

        {notite.length > 0 && (
          <select onChange={(e) => setNotitaSelectata(e.target.value)}>
            <option value="">Selectează o notiță</option>
            {notite.map((notita, index) => (
              <option key={index} value={notita.name}>
                {notita.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <textarea
        className="textbox-intrebare"
        placeholder="Scrie întrebarea ta pentru AI..."
        value={intrebare}
        onChange={(e) => setIntrebare(e.target.value)}
      />

      <button className="btn-trimite" onClick={handleTrimite}>
        Trimite întrebarea
      </button>

      {loading && <p className="loading-msg">Se generează răspunsul...</p>}

      <textarea
        className="textbox-raspuns"
        placeholder="Aici va apărea testul generat de AI:"
        value={raspuns}
        readOnly
      />
    </div>
  );
};

export default LearningPlan;
