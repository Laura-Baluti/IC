import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './index.css';
import Login from './Login';
import Register from './Register';
import Notite from './Notite';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notite" element={<Notite />} />
        <Route path="/home" element={<div>Acasă</div>} />
      </Routes>
    </Router>
  );
};

const Navbar = () => {
  const location = useLocation(); // Get the current location

  // Conditionally render navbar based on the current route
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null; // Don't render navbar on login or register pages
  }

  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="/home">Pagina Principală</a>
        <a href="/notite">Notițe</a>
        <a href="/learning-plan">Learning Plan</a>
      </div>
      <div className="profile-container">
        <span className="profile-text">Profil</span>
        <div className="dropdown">
          <div className="dropdown-content">
            <a href="#">Setări</a>
            <a href="/login">Deconectare</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;
