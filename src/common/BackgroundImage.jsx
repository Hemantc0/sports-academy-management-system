import React, { useState, useEffect } from 'react';

export default function BackgroundImage() {
  const images = [
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1920&auto=format&fit=crop",  
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop" 
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    images.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundColor: '#1a1a1a', 
        overflow: 'hidden', 
      }}
    >
      <div
        style={{
          display: 'flex',
          width: `${images.length * 100}vw`,
          height: '100vh',
          transform: `translateX(-${currentIndex * 100}vw)`, // Pushes images to the left
          transition: 'transform 1.5s ease-in-out', 
        }}
      >
        {images.map((url, index) => (
          <div
            key={index}
            style={{
              width: '100vw',
              height: '100vh',
              backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.75), rgba(15, 15, 15, 0.75)), url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}