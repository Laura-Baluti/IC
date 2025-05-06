import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        // Send POST request with username and password to your backend
        const response = await axios.post('http://localhost:8080/login', null, {
          params: { username, password }
        });

        if (response.status === 200) {
          // Get the userId from the response body (now inside the object)
          const userId = response.data.userId; // Expecting { userId: "someUserId" }
          console.log('User ID: ',userId)
          // Store userId in localStorage
          localStorage.setItem('userId', userId);

          alert('Autentificare reușită!'); // Optional success message
          
          // Redirect to home page
          navigate("/home");
        }
      } catch (error) {
        // Handle error response from backend
        console.error('Eroare la autentificare:', error);
        
        // Check if error response is structured (as per the backend)
        if (error.response) {
          // If the backend sends an error message in the response body, handle it
          setError(error.response.data.error || "Eroare la autentificare!"); // Assuming error is in { error: "message" }
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

        <button type="submit">Conectează-te</button>

        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        
        {/* Register Link */}
        <div className="register-container">
          <p><Link to="/register" className="register-link">Creează un cont!</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;