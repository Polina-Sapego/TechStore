import Logo from '@images/logo.png';
import CartButton from '../cart/CartButton.tsx';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '@store/user/store.ts';
import { useCartDrawer } from '../cart/useCartDrawer.tsx';
import Cookies from 'js-cookie';

const Index: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const { open, close } = useCartDrawer();

  const handleCartClick = () => {
    if (!user) {
      navigate('/authorization');
      return;
    }
    open();
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
    close();
    navigate('/');
  };

  return (
    <div className="home-page">
      <header className="main-header">
        <div className="logo-tech-store">
          <img src={Logo} alt="TechStore Logo" className="logo-tech-store-img" />
          <h1 className="tech-store-title">TechStore</h1>
        </div>
        <div className="logo-register-buttons">
          {!user && (
            <button onClick={handleCartClick} className="auth-button">Login / Register</button>
          )}
          {user && (
            <>
              <CartButton />
              <button onClick={handleLogout} className="auth-button">Logout</button>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Index;
