import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Login from './Login';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <a href="/">Pagina Principală</a>
          <a href="/notite">Notițe</a>
          <a href="/learning-plan">Learning Plan</a>
        </div>
        <div className="profile-container">
          <span className="profile-text">Profil</span>
          <div className="dropdown">
            <div className="dropdown-content">
              <a href="#">Setări</a>
              <a href="#">Deconectare</a>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<div>Acasă</div>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
