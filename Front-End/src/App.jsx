import React from "react";

const App = () => {
  return (
    <div>
      <nav className="navbar">
        <a href="#" className="nav-link">Pagina Principală</a>
        <a href="#" className="nav-link">Notițe</a>
        <a href="#" className="nav-link">Learning Plan</a>
        
        
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


      <main className="principal">
        <h1>Bine ai venit!</h1>
      </main>


    </div>

    
  );
};

export default App;
