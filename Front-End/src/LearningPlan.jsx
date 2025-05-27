import React, { useState } from "react";
import './LearningPlan.css';

const LearningPlan = () => {
  const [intrebare, setIntrebare] = useState("");
  const [raspuns, setRaspuns] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrimite = () => {
    if (!intrebare.trim()) return;

    setLoading(true);
    setRaspuns(""); // șterge răspunsul anterior

    // simulăm un răspuns AI (ex: folosim timeout)
    setTimeout(() => {
      setRaspuns(`Răspuns AI pentru: "${intrebare}" 😎`);
      setLoading(false);
    }, 1500);
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
