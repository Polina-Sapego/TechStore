import React, { useState } from 'react';
import ProductCard from './productCard.tsx';
import { products } from './productsMoc.ts';
import Logo from '../../../images/logo.png';
import AllProduct from '../../../images/allProduct.png';
import HeadPhones from '../../../images/headPhone.png';
import Phones from '../../../images/phone.png';
import Laptops from '../../../images/laptop.png';

const HomePage: React.FC = () => {
  const [active, setActive] = useState('all');

  const categories = [
    {id: 'all', label: 'All', img: AllProduct},
    {id: 'phones', label: 'Phones', img: Phones},
    {id: 'laptops', label: 'Laptops', img: Laptops},
    {id: 'accessories', label: 'Accessories', img: HeadPhones},
  ];

  return (
    <div className="home-page">
      <header className="main-header">
        <div className="logo-tech-store">
          <img src={Logo} alt="TechStore Logo" className="logo-tech-store-img"/>
          <h1 className="tech-store-title">TechStore</h1>
        </div>
        <div className="logo-register-buttons">
          <button className="auth-button">Login</button>
          <button className="auth-button">Register</button>
        </div>
      </header>
      <div className="tech-store-category-buttons">
        {categories.map(({id, label, img}) => (
          <button
            key={id}
            className={active === id ? 'category-button active' : 'category-button'}
            onClick={() => setActive(id)}
          >
            <img className="category-img" src={img} alt={label}/>
            <span className="category-name">{label}</span>
          </button>
        ))}
      </div>
      <div className="tech-store-grid-section">
        <div className="tech-store-grid-sort">
          <label className="grid-sort" htmlFor="sort">
            Sort by price:
          </label>
          <select className="grid-select-sort" id="sort">
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
