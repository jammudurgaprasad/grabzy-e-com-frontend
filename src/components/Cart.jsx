import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Cart.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 👈 Added


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
      withCredentials: true,
    }).then(res => {
      setUserId(res.data.userId);
    }).catch(() => {
      navigate('/login');
    });
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${userId}`, {
  withCredentials: true,
})
.then(res => {
  setCartItems(res.data);
})
.catch(() => {
  setCartItems([]);
})
.finally(() => {
  setLoading(false); // 👈 stop loading
});

    }
  }, [userId]);

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;
    const item = cartItems.find(ci => ci.cartId === cartId);
    if (!item) return;

    try {
      const updated = { ...item, quantity: newQty };
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/carts/${cartId}`, updated, {
        withCredentials: true,
      });
      setCartItems(prev => prev.map(ci => (ci.cartId === cartId ? { ...ci, quantity: newQty } : ci)));
    } catch {
      alert('Failed to update quantity');
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/carts/${cartId}`, {
        withCredentials: true,
      });
      setCartItems(prev => prev.filter(ci => ci.cartId !== cartId));
    } catch {
      alert('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const actualTotal = cartItems.reduce((sum, item) => sum + item.product.actualPrice * item.quantity, 0);
  const saved = actualTotal - subtotal;
  const deliveryFee = subtotal > 500 ? 0 : 69;
  const platformFee = 5;
  const totalPayable = subtotal + deliveryFee + platformFee;


if (loading) {
  return (
    <>
      <Navbar />
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </>
  );
}




  if (!cartItems.length) {
    return <><Navbar/><div className="cart-empty">🛒 Your cart is empty.</div></>;
  }

  return (
    <>
    <Navbar/>
    <div className="cart-modern-container">
      <div className="cart-modern-content">
        {/* Left - Cart Items */}
        <div className="cart-modern-items">
          <h2>Shopping Cart</h2>
          {cartItems.map(item => (
            <div className="cart-modern-item" key={item.cartId}>
              <img src={item.product.image1} alt={item.product.productName} className="cart-modern-image" />
              <div className="cart-modern-details">
                <h3>{item.product.productName}</h3>
                <p className="price-line">
                  <span className="discounted-price">₹{Math.floor(item.product.discountPrice)}</span>
                  <span className="actual-price">₹{Math.floor(item.product.actualPrice)}</span>
                  <span className="discount-percent">({item.product.discountPercentage}% OFF)</span>
                </p>
                {item.size && <p className="cart-size">Size: {item.size}</p>}
                <div className="cart-modern-qty">
                  <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                </div>
              </div>
              <span className="material-symbols-outlined cart-modern-delete" onClick={() => removeFromCart(item.cartId)}>
                delete
              </span>
            </div>
          ))}
        </div>

        {/* Right - Billing Summary */}
        <div className="cart-modern-summary">
          <h2>Price Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Math.floor(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="summary-row savings">
            <span>You Saved</span>
            <span className="green">₹{Math.floor(saved)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Math.floor(totalPayable)}</span>
          </div>
            <button className="place-order-btn" onClick={() => navigate('/place-order')}>
            Place Order
            </button>
        </div>
      </div>
    </div>
  </>
  );
}
