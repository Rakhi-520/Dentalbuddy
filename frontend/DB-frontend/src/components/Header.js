import React from 'react';
import './Header.css';
import logo from '../assets/dental-buddy-logo.png'; 

const Header = () => {
  return (
    <div className="header-background">
      <div className="header-content">
        <img src={logo} alt="DentalBuddy Logo" className="header-logo" />
        <div className="header-text">
          <h1 className="clinic-name">DENTAL BUDDY</h1>
          <p className="clinic-tagline">Your Complete Dental Practice Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
