import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import Navbar from './Navbar';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    fetchUserAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user?.userId || !isAuthenticated) return;

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/user/${user.userId}`, { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders", err));
  }, [user, isAuthenticated]);

  const cancelOrder = (id) => {
    axios.patch(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}/status?status=CANCELLED`, {}, { withCredentials: true })
      .then(() => setOrders(prev => prev.map(o => o.orderId === id ? { ...o, status: 'CANCELLED' } : o)))
      .catch(err => console.error("Cancel failed", err));
  };

  if (!user) return <><Navbar /><div>Loading orders...</div></>;

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-left">
          <h2>Orders</h2>
          <div className="btn-group">
            <button className="btn-add" onClick={() => navigate('/profile')}>👤 View Profile</button>
          </div>
        </div>

        <div className="profile-right">
          <div className="order-list">
            <h3>Your Orders</h3>
            {orders.map(o => (
              <div key={o.orderId} className="order-card">
                <div className="order-left">
                  <img src={o.image1} alt={o.productName} />
                </div>
                <div className="order-center" onClick={() => navigate(`/order/${o.orderId}`)}>
                  <h4>{o.productName}</h4>
                  <p>
                    ₹<strong>{o.discountPrice}</strong>&nbsp;
                    <span className="old-price">₹{o.actualPrice}</span>&nbsp;
                    <span className="discount">({o.discountPercentage}% OFF)</span>
                  </p>
                </div>
                <div className="order-right">
                  <span className="status">{o.status}</span>
                  {o.status === 'PENDING' && (
                    <button className="cancel-btn" onClick={() => cancelOrder(o.orderId)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
