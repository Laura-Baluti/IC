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
      <div className="text-section">
        <h1>Bine ai revenit!</h1>
        <p>{messages[index]}</p>
      </div>
      <div className="carousel">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`carousel-img ${i === index ? 'active' : ''}`}
            alt={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
