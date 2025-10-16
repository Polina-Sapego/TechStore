import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from './productCard.tsx';
import { products } from './productsMoc.ts';
import Logo from '../../../images/logo.png';
import AllProduct from '../../../images/allProduct.png';
import HeadPhones from '../../../images/headPhone.png';
import Phones from '../../../images/phone.png';
import Laptops from '../../../images/laptop.png';

const HomePage: React.FC = () => {
  const [active, setActive] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(
    (sessionStorage.getItem('sortOrder') as 'asc' | 'desc' | null) || null
  );

  const categories = [
    { id: 'all', label: 'All', img: AllProduct },
    { id: 'phones', label: 'Phones', img: Phones },
    { id: 'laptops', label: 'Laptops', img: Laptops },
    { id: 'accessories', label: 'Accessories', img: HeadPhones },
  ];

  useEffect(() => {
    if (sortOrder) {
      sessionStorage.setItem('sortOrder', sortOrder);
    } else {
      sessionStorage.removeItem('sortOrder');
    }
  }, [sortOrder]);

  const displayedProducts = useMemo(() => {
    if (!sortOrder) return products;
    return [...products].sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
  }, [sortOrder]);

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
        </div>
      </header>

      <div className="tech-store-category-buttons">
        {categories.map(({ id, label, img }) => (
          <button
            key={id}
            className={active === id ? 'category-button active' : 'category-button'}
            onClick={() => setActive(id)}
          >
            <img className="category-img" src={img} alt={label} />
            <span className="category-name">{label}</span>
          </button>
        ))}
      </div>

      <div className="tech-store-grid-section">
        <div className="tech-store-grid-sort">
          <label className="grid-sort" htmlFor="sort">
            Sort by price:
          </label>
          <select
            className="grid-select-sort"
            id="sort"
            value={sortOrder ?? ''}
            onChange={(e) => {
              const value = e.target.value as 'asc' | 'desc' | '';
              setSortOrder(value === '' ? null : value);
            }}
          >
            <option value="">Select...</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div className="product-grid">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
