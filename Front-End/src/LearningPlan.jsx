import React, { useState } from "react";
import './LearningPlan.css';

const LearningPlan = () => {
  const [intrebare, setIntrebare] = useState("");
  const [raspuns, setRaspuns] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrimite = async () => {
    if (!intrebare.trim()) return;

    setLoading(true);
    setRaspuns(""); // clear previous answer

    const fileId = localStorage.getItem("fileId"); // get fileId from localStorage
    if (!fileId) {
      setRaspuns("File ID not found in local storage!");
      setLoading(false);
      return;
    }

    try {
      // Build the URL with fileId and send question as query param
      const backendUrl = "http://localhost:8080"; 
      const url = `${backendUrl}/learning-plan/${fileId}?question=${encodeURIComponent(intrebare)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server error");
      }

      const answer = await response.text();
      setRaspuns(answer);

    } catch (error) {
      setRaspuns("Eroare la comunicarea cu serverul: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learning-plan-container">
      <h2>Întreabă AI-ul tău educațional</h2>

      <textarea
        placeholder="Scrie întrebarea ta aici..."
        value={intrebare}
        onChange={(e) => setIntrebare(e.target.value)}
        className="textbox-intrebare"
      />

      <button onClick={handleTrimite} className="btn-trimite">
        Trimite întrebarea
      </button>

      <textarea
        placeholder="Aici apare răspunsul AI-ului..."
        value={raspuns}
        readOnly
        className="textbox-raspuns"
      />

      {loading && <p className="loading-msg">Se generează răspunsul...</p>}
    </div>
  );
};

export default LearningPlan;
