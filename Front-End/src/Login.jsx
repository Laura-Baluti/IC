import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  // Folosim useState pentru a gestiona valorile introduse de utilizator
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Funcția pentru gestionarea submit-ului formularului
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      // Poți adăuga logica de autentificare aici (de exemplu, validare cu backend sau localStorage)
      alert(`Autentificare reușită! Username: ${username}`);
      // După autentificare, poți face redirecționarea către pagina principală, dacă vrei
    } else {
      alert('Te rugăm să completezi toate câmpurile!');
    }
  };

  return (
    <div className="login-container">
      <h2>Autentificare</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Introdu username-ul"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Parolă</label>
        <input
          type="password"
          placeholder="Introdu parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Conectează-te</button>
      </form>
    </div>
  );
};

export default Login;
