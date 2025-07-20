import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/OrderDetails.css';
import Navbar from './Navbar';
import { Player } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(null);
const statusSteps = [
  { name: 'PENDING', animation: 'https://lottie.host/5737e681-77d8-4bdb-ae45-d9f1feac7ede/hZKkQG0f3P.lottie' },
  { name: 'SHIPPED', animation: 'https://lottie.host/6ef6944f-4251-479b-9214-2bc8eff9a1a3/luFuPYt7um.lottie' },
  { name: 'OUT FOR DELIVERY', animation: 'https://lottie.host/2ac4e970-6c36-4c03-a7f6-2ccce4959328/BJdzfziiSE.lottie' },
  { name: 'DELIVERED', animation: 'https://lottie.host/ee131fa2-a635-4c8b-b77c-5630f4f38391/7vbi9rS0qI.lottie' }
];

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
    if (!isAuthenticated) return;

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`, {
        withCredentials: true,
      })
      .then((res) => setOrder(res.data))
      .catch((err) => {
        console.error('Failed to fetch order', err);
        setError('Failed to load order details.');
      });
  }, [orderId, isAuthenticated]);


// const getStatusSteps = () => {
//   const currentIndex = statusSteps.findIndex(step => step.name === order.status);

//   return (
//     <div className="status-vertical-wrapper">
//       {statusSteps.map((step, index) => (
//         <div key={step.name} className={`status-block ${index <= currentIndex ? 'active-block' : ''}`}>
//           <Player
//             autoplay
//             loop={false}
//             src={step.animation}
//             className="status-animation"
//           />
//           <p className="status-step-name">{step.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };



// const getStatusSteps = () => {
//   const currentIndex = statusSteps.findIndex(step => step.name === order.status);

//   return (
//     <div className="status-vertical-wrapper">
//       {statusSteps.map((step, index) => (
//         <div key={step.name} className={`status-block ${index <= currentIndex ? 'active-block' : ''}`}>
//           <DotLottieReact
//             src={step.animation}
//             autoplay
//             loop
//             style={{ width: '40px', height: '40px' }}
//           />
//           <p className="status-step-name">{step.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };



const getStatusSteps = () => {
  const currentStep = statusSteps.find(step => step.name === order.status);

  if (!currentStep) return null;

  return (
    <div className="single-status-wrapper">
      <DotLottieReact
        src={currentStep.animation}
        autoplay
        loop
        style={{ width: '150px', height: '150px' }}
      />
      <p className="single-status-label">{currentStep.name}</p>
    </div>
  );
};








  const cancelOrder = () => {
    axios.patch(`${process.env.REACT_APP_API_BASE_URL}/orders/${order.orderId}/status?status=CANCELLED`, {}, {
      withCredentials: true,
    })
      .then(() => setOrder({ ...order, status: 'CANCELLED' }))
      .catch(err => console.error("Cancel failed", err));
  };

  if (error) return <><Navbar /><div className="order-details-wrapper">{error}</div></>;
  if (!order) return <><Navbar /><div className="order-details-wrapper">Loading...</div></>;

  return (
    <>
      <Navbar />
      <div className="order-details-wrapper">
        <h2>Order ID : {order.orderId}</h2>

        <div className="order-main-card" onClick={() => navigate(`/product/${order.productId}`)} style={{ cursor: 'pointer' }}>
          <img
            src={order.image1}
            alt={order.productName}
            className="order-image"
          />

          <div className="order-info">
            <h3>{order.productName}</h3>
            <p className="price-line">
              ₹{Math.floor(order.discountPrice)}
              <span className="old-price">₹{Math.floor(order.actualPrice)}</span>
              <span className="discount">({order.discountPercentage}% OFF)</span>
            </p>
            <p>Size: {order.size}</p>
            <p>Quantity: {order.quantity || 1}</p>
          </div>

          <div className="order-status-block">
            <p className="status-label">Status:</p>
            <div className="status-line">{getStatusSteps()}</div>
            {order.status === 'PENDING' && (
              <button className="cancel-button" onClick={cancelOrder}>Cancel</button>
            )}
          </div>
        </div>

        <div className="delivery-info">
          <h4>Delivery Address:</h4>
          <p><strong>{order.receiverName}</strong></p>
          <p>{order.address}</p>
          <p>
            {order.city}, {order.district}, {order.state} - {order.pincode}
          </p>
          <p>Phone: {order.phoneNumber}</p>
        </div>
      </div>
    </>
  );
}
