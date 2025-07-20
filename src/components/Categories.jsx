import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Categories.css';

const categories = [
  { name: 'Mobiles', icon: 'smartphone' },
  { name: 'Appliances', icon: 'tv' },
  { name: 'Electronics', icon: 'memory' },
  { name: 'Beauty', icon: 'spa' },
  { name: 'Fashion', icon: 'checkroom' },
  { name: 'Food', icon: 'restaurant' },
  { name: 'Home & Kitchen', icon: 'kitchen' },
  { name: 'Furniture', icon: 'weekend' },
  { name: 'Grocery', icon: 'shopping_bag' },
];

export default function Categories() {
  return (
    <div className="categories-container">
      {categories.map((cat, idx) => (
        <Link
          key={idx}
          to={`/category/${encodeURIComponent(cat.name)}`}
          className="category-item"
        >
          <span className="material-symbols-outlined category-icon">{cat.icon}</span>
          <span className="category-name">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
