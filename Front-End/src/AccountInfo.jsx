// AccountInfo.jsx
import React, { useEffect, useState } from "react";
import './AccountInfo.css';

const AccountInfo = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Simulăm extragerea informațiilor din localStorage
    const email = localStorage.getItem("userEmail"); // presupunem că ai salvat emailul la login
    setUserEmail(email || "necunoscut@exemplu.com");
  }, []);

  return (
    <div className="account-info-container">
      <h2>Informații cont</h2>
      <div className="info-section">
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Nume:</strong> (de completat...)</p>
        <p><strong>Parolă:</strong> ******</p>
      </div>
    </div>
  );
};

export default AccountInfo;
