// Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';

const images = [
  '/images/img8.jpeg',
  '/images/img1.jpeg',
  '/images/img9.jpeg',
  '/images/img3.jpeg',
  '/images/img13.jpg',
  '/images/img14.jpg'
];

const messages = [
  "Fii constant, nu perfect!",
  "Organizează-ți timpul eficient! ",
  "Învață cu stil și plăcere!",
  "Fii constant, nu perfect 🚀",
  "Învață cu stil și plăcere 🌟",
  "Fii constant, nu perfect 🚀"
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-wrapper">
  <div className="left-section">
    <div className="glow-circle"></div>
      <div className="glowing-text">
    <h1 className="monoton-regular">EXPLOREAZĂ.</h1>
     <h1 className="monoton-regular">ÎNVAȚĂ.</h1>
      <h1 className="monoton-regular">CREȘTE.</h1>
  </div>
      </div>

  <div className="right-section">
  <div className="learning-plan-box">
    <h1 className="monoton-regular">LEARN WITH AI</h1>
    <p className="learning-subtext">Lasă inteligența artificială să te ghideze în procesul tău de învățare!</p>
    <a href="/learning-plan" className="learning-btn">Vezi ghidul tău AI</a>
  </div>
</div>
</div>

  );
};

export default Home;
