import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/CategoryPage.css';
import Navbar from './Navbar';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
    withCredentials: true,
  }).catch(() => {});
}, []);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/product`).then(res => {
      const filtered = res.data.filter(p => p.category === categoryName);
      setProducts(filtered);
    });
  }, [categoryName]);

  return (
    <>
      <Navbar />
      <div className="category-page">
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <aside className={`filters ${showFilters ? 'show' : ''}`}>
          <h4>Filters</h4>
          <label><input type="checkbox" /> Under ₹500</label>
          <label><input type="checkbox" /> ₹500 – ₹1000</label>
          <label><input type="checkbox" /> Above ₹1000</label>
          <label><input type="checkbox" /> 20%+ Off</label>
        </aside>

        <main className="products-area">
          <h2>{categoryName}</h2>
          <div className="product-grid">
            {products.map(product => (
              <Link key={product.productId} to={`/product/${product.productId}`} className="card-link">
                <div className="prod-card">
                  <div className="prod-img-container">
                    {product.image1 ? (
                      <img src={product.image1} alt={product.productName} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="info">
                    <p className="name">{product.productName}</p>
                    <p className="price">
                      ₹{Math.floor(product.discountPrice)}
                      <span className="actual">₹{Math.floor(product.actualPrice)}</span>
                      <span className="off">({Math.round(product.discountPercentage)}% OFF)</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
