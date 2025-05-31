import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './index.css';
import Login from './Login';
import Register from './Register';
import Notite from './Notite';
import Home from './Home';
import AccountInfo from './AccountInfo';
import LearningPlan from './LearningPlan';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subjects" element={<Notite />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<AccountInfo />} />
        <Route path="/learning-plan" element={<LearningPlan />} />
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
        <a href="/subjects">Notițe</a>
        <a href="/learning-plan">Învață cu AI</a>
      </div>
      <div className="profile-container">
        <span className="profile-text">Profil</span>
        <div className="dropdown">
          <div className="dropdown-content">
            <a href="/account">Informații cont</a>
            <a href="/login">Deconectare</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;
