import React from 'react';
import StarRating from './starRating.tsx';
import { useCartStore } from '../../store/cart/store.ts';
import { useCartDrawer } from '../cart/useCartDrawer.tsx';
import { useAuthStore } from '../../store/user/store.ts';
import { useNavigate } from 'react-router-dom';

export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  image?: string;
  category: string;
  inStock: boolean;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const addProduct = useCartStore((s) => s.addProduct)
  const { open } = useCartDrawer()
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) {
      navigate('/authorization');
      return;
    } else {
      addProduct({
        id: product.id,
        title: product.title,
        price: product.price,
        qty: 1,
        image: product.image,
      });
      open();
    }
  };

  return (
    <div className="product-card">
      <div className="card-image-box">
        <img src={product.image} alt={product.title} className="card-image"/>
      </div>
      <div className="card-content">
        <h3 className="card-name" data-testid="product-title">{product.title}</h3>
        <StarRating rating={product.rating}/>
        <p className="card-price" data-testid="product-price">${product.price}</p>
        <button className="card-button" onClick={handleAdd}>Add to cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
