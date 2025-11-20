import React, { useEffect, useState } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import ProductCard, { type Product } from './productCard.tsx';
import AllProduct from '../../../assets/images/allProduct.png';
import HeadPhones from '../../../assets/images/headPhone.png';
import Phones from '../../../assets/images/phone.png';
import Laptops from '../../../assets/images/laptop.png';
import { fetchProducts } from '../../api/products.ts';
import { useCartStore } from '../../store/cart/store.ts';

const categories = [
  { id: 'all', label: 'All', img: AllProduct },
  { id: 'phones', label: 'Phones', img: Phones },
  { id: 'laptops', label: 'Laptops', img: Laptops },
  { id: 'accessories', label: 'Accessories', img: HeadPhones },
];

const HomePage: React.FC = () => {
  const [active, setActive] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(
    (sessionStorage.getItem('sortOrder') as 'asc' | 'desc' | null) || null,
  );
  const connectWebSocket = useCartStore((s) => s.connectWebSocket);

  useEffect(() => {
    console.log('HomePage mounting — call connectWebSocket()');
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    if (sortOrder) sessionStorage.setItem('sortOrder', sortOrder);
    else sessionStorage.removeItem('sortOrder');
  }, [sortOrder]);

  const { data, isLoading, isError } = useQuery(
    {
      queryKey: ['products', active, sortOrder],
      queryFn: () => fetchProducts(active, sortOrder),
      keepPreviousData: true,
    } as UseQueryOptions<Product[], Error, Product[], readonly unknown[]>,
  );

  const products: Product[] = data ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load products</div>;

  return (
    <div className="home-page">
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
