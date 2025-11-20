import Logo from '../../../assets/images/logo.png';
import CartButton from '../cart/CartButton.tsx';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="home-page">
      <header className="main-header">
        <div className="logo-tech-store">
          <img src={Logo} alt="TechStore Logo" className="logo-tech-store-img" />
          <h1 className="tech-store-title">TechStore</h1>
        </div>
        <div className="logo-register-buttons">
          <button className="auth-button">Login</button>
          <button className="auth-button">Register</button>
          <CartButton />
        </div>
      </header>
    </div>
  );
};

export default Header;
