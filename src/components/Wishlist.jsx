import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
    withCredentials: true,
  }).catch(() => {});
}, []);

useEffect(() => {
  if (!user?.userId) return;

  // Only fetch once when userId is first available
const fetchWishlist = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/wishlist/user/${user.userId}`, {
      withCredentials: true,
    });
    const sortedWishlist = res.data.sort((a, b) => b.id - a.id); // ✅ Sort newest first
    setWishlist(sortedWishlist);
  } catch (err) {
    console.error("Failed to fetch wishlist", err);
  } finally {
    setLoading(false);
  }
};


  fetchWishlist();
}, [user?.userId]);





  const removeFromWishlist = (id) => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/wishlist/${id}`, {
      withCredentials: true,
    })
      .then(() => setWishlist(prev => prev.filter(w => w.id !== id)))
      .catch(err => console.error("Failed to remove from wishlist", err));
  };

  // if (!user) return <><Navbar /><div>Loading wishlist...</div></>;

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-left">
          <h2>Wishlist</h2>
          <div className="btn-group">
            <button className="btn-add" onClick={() => navigate('/profile')}>👤 View Profile</button>
          </div>
        </div>




<div className="profile-right">
  <div className="order-list">
    <h3>Your Wishlist</h3>

    {loading ? (
      <div className="loader-container-inner">
        <div className="loader"></div>
      </div>
    ) : wishlist.length === 0 ? (
      <p>No items in wishlist.</p>
    ) : (
      wishlist.map(item => (
        <div key={item.id} className="order-card">
          <div className="order-left">
            <img src={item.product.image1} alt={item.product.productName} />
          </div>
          <div className="order-center" onClick={() => navigate(`/product/${item.product.productId}`)}>
            <h4>{item.product.productName}</h4>
            <p>
              ₹<strong>{item.product.discountPrice}</strong>&nbsp;
              <span className="old-price">₹{item.product.actualPrice}</span>&nbsp;
              <span className="discount">({item.product.discountPercentage}% OFF)</span>
            </p>
          </div>
          <div className="order-right">
            <button className="cancel-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
      </div>
    </>
  );
}
