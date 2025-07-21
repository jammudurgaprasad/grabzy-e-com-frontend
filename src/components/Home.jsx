import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Categories from './Categories';
import Navbar from './Navbar';

export default function Home() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   axios.get(`${process.env.REACT_APP_API_BASE_URL}/product`).then(res => {
  //     const grouped = {};
  //     res.data.forEach(p => {
  //       grouped[p.category] ||= [];
  //       grouped[p.category].push(p);
  //     });
  //     setData(grouped);
  //     setLoading(false);
  //   });
  // }, []);


  useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_BASE_URL}/product`)
    .then(res => {
      const grouped = {};
      const products = Array.isArray(res.data) ? res.data : [];

      products.forEach(p => {
        grouped[p.category] ||= [];
        grouped[p.category].push(p);
      });

      setData(grouped);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load products:", err);
      setLoading(false);
    });
}, []);





  const renderSkeletons = (count = 5) => (
    Array(count).fill(null).map((_, index) => (
      <div key={index} className="prod-card skeleton">
        <div className="prod-img-container skeleton-box" />
        <div className="info">
          <div className="skeleton-line short" />
          <div className="skeleton-line long" />
        </div>
      </div>
    ))
  );

  return (
    <>
      <Navbar />
      <Categories />
      <div className="home-container">
        {loading ? (
          <section className="cat-section">
            <div className="cat-header">
              <h3>Loading...</h3>
            </div>
            <div className="scroll-row">
              {renderSkeletons(6)}
            </div>
          </section>
        ) : (
          Object.entries(data).map(([cat, products]) => (
            <section key={cat} className="cat-section">
              <div className="cat-header">
                <h3>{cat}</h3>
                <Link to={`/category/${encodeURIComponent(cat)}`} className="view-more">View More</Link>
              </div>
              <div className="scroll-row">
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
            </section>
          ))
        )}
      </div>
    </>
  );
}
