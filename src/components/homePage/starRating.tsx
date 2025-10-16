import React from 'react';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({rating}) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((value) => (
      <span key={value} className={value <= rating ? 'star filled' : 'star'}>
        ★
      </span>
    ))}
  </div>
);

export default StarRating;
