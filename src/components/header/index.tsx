import Logo from '../../../assets/images/logo.png';
import CartButton from '../cart/CartButton.tsx';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '../../store/user/store.ts';
import { useCartDrawer } from '../cart/useCartDrawer.tsx';

const Index: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { open } = useCartDrawer();
  console.log(user);

  const handleCartClick = () => {
    if (!user) {
      navigate('/authorization');
      return;
    }
    open();
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
          {user && <CartButton />}
        </div>
      </header>
    </div>
  );
};

export default Index;
