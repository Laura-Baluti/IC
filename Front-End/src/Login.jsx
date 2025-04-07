import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import './Login.css';
import { useNavigate, Link } from 'react-router-dom'; // Import for page redirection


const Login = () => {
  // State hooks for managing input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error handling

  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        // Send a POST request with username and password to your backend
        const response = await axios.post('http://localhost:8080/login', null, {
          params: { username, password }
        });

        // Handle successful response from backend
        if (response.status === 200) {
          alert(response.data); // Backend sends a success message
          // You can redirect to another page if needed
          navigate("/"); // Redirect to home after successful login
        }
      } catch (error) {
        // Handle error response from backend
        console.error('Eroare la autentificare:', error);
        if (error.response) {
          setError(error.response.data); // Backend sends error message
        }
      }
    } else {
      setError('Te rugăm să completezi toate câmpurile!');
    }
  };

  return (
    <div className="login-container">
      <h2>Autentificare</h2>
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

        <button type="submit">Conecteaza-te</button>

        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        
        {/* Register Link */}
        <div className="register-container">
          <p><Link to="/register" className="register-link">Creeaza un cont!</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
