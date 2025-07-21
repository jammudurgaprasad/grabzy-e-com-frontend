import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CategoriesOption.css';
import Navbar from './Navbar';

const categories = [
  { name: 'Mobiles', image: 'https://example.com/mobiles.jpg' },
  { name: 'Appliances', image: 'https://example.com/appliances.jpg' },
  { name: 'Electronics', image: 'https://example.com/electronics.jpg' },
  { name: 'Beauty', image: 'https://example.com/beauty.jpg' },
  { name: 'Fashion', image: 'https://example.com/fashion.jpg' },
  { name: 'Food', image: 'https://example.com/food.jpg' },
  { name: 'Home & Kitchen', image: 'https://example.com/kitchen.jpg' },
  { name: 'Furniture', image: 'https://rukminim2.flixcart.com/image/128/128/xif0q/bed/g/p/p/king-208-2-n-a-no-187-9-particle-board-yes-105-ws-clemcy-fw-k-original-imahdnua6gw2mkgh.jpeg?q=70&crop=false' },
  { name: 'Grocery', image: 'https://example.com/grocery.jpg' },
];

const CategoriesOption = () => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (name) => {
    setLoadedImages((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <>
    <Navbar/>
    <div className="categories-option-vertical">
      {categories.map((cat, idx) => (
        <div
          key={idx}
          className="category-button"
          onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
        >
          {!loadedImages[cat.name] && <div className="image-skeleton" />}
          <img
            src={cat.image}
            alt={cat.name}
            className={`category-image ${loadedImages[cat.name] ? 'visible' : 'hidden'}`}
            onLoad={() => handleImageLoad(cat.name)}
            onError={() => handleImageLoad(cat.name)}
          />
          <div className="category-label">{cat.name}</div>
        </div>
      ))}
    </div>
    </>
  );
};

export default CategoriesOption;
