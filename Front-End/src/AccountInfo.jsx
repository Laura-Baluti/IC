import React, { useEffect, useState } from "react";
import axios from "axios";
import './AccountInfo.css';

const AccountInfo = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios.get(`http://localhost:8080/account/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Eroare la preluarea datelor utilizatorului:", error);
        });
    }
  }, []);

  const handleDeleteUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Nu s-a găsit ID-ul utilizatorului în localStorage!");
      return;
    }

    const confirmDelete = window.confirm("Ești sigur că vrei să ștergi acest cont? Această acțiune este ireversibilă.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/account/${userId}`);
      alert("Contul tău a fost șters cu succes!");
      localStorage.clear();
      window.location.href = "/"; // redirect to home/login
    } catch (error) {
      console.error("Eroare la ștergerea contului:", error);
      alert("A apărut o eroare la ștergerea contului.");
    }
  };

  return (
    <div className="account-info-container">
      <h2>INFORMAȚII CONT</h2>
      <div className="info-section">
        <p><strong>Email:</strong> {userData?.email || "necunoscut"}</p>
        <p><strong>Nume:</strong> {userData?.username || "necunoscut"}</p>
        <p><strong>Parolă:</strong> {userData?.password || "******"}</p>
      </div>
      <button className="delete-user-btn" onClick={handleDeleteUser}>
          Șterge contul
        </button>
    </div>
  );
};

export default AccountInfo;
