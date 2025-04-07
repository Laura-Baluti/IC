import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';  // Reusing the same Login.css for styling
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password && email) {
      try {
        const response = await axios.post('http://localhost:8080/register', { username, password, email });

        if (response.status === 200) {
          alert(response.data);
          navigate("/login");  // Redirect to login after successful registration
        }
      } catch (error) {
        console.error('Eroare la inregistrare:', error);
        if (error.response) {
          setError(error.response.data);
        }
      }
    } else {
      setError('Te rugăm să completezi toate câmpurile!');
    }
  };

  return (
    <div className="login-container">
      <h2>Inregistrare</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Nume</label>
        <input
          type="text"
          placeholder="Introdu numele"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Parola</label>
        <input
          type="password"
          placeholder="Introdu parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Introdu email-ul"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Inregistreaza-te</button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
