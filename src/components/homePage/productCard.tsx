import React from 'react';
import StarRating from './starRating.tsx';

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  image?: string;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  return (
    <div className="product-card">
      <div className="card-image-box">
        <img src={product.image} alt={product.title} className="card-image"/>
      </div>
      <div className="card-content">
        <h3 className="card-name">{product.title}</h3>
        <StarRating rating={product.rating}/>
        <p className="card-price">${product.price}</p>
        <button className="card-button">Add to cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
