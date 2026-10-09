import React from 'react';
import stadiumImg from '../assets/stadium.jpg'; 

export default function AdminWelcome() {
  return (
    <div className="container-fluid p-0 mt-3">
      <div id="adminHeroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src={stadiumImg} 
              className="d-block w-100 rounded" 
              alt="Stadium Background" 
              style={{ height: '80vh', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}