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

  return (
    <div className="account-info-container">
      <h2>INFORMAȚII CONT</h2>
      <div className="info-section">
        <p><strong>Email:</strong> {userData?.email || "necunoscut"}</p>
        <p><strong>Nume:</strong> {userData?.username || "necunoscut"}</p>
        <p><strong>Parolă:</strong> {userData?.password || "******"}</p>
      </div>
    </div>
  );
};

export default AccountInfo;
