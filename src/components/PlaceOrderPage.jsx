import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Cart.css"; // reuse cart styles
import Navbar from "./Navbar";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const PlaceOrderPage = () => {
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("cod"); // 'cod' or 'online'
  const [showSuccess, setShowSuccess] = useState(false);
  


  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
          withCredentials: true,
        });
        setUserId(res.data.userId);
      } catch (err) {
        console.error("User auth check failed:", err);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/addresses/user/${userId}`);
        setAddresses(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${userId}`, {
          withCredentials: true,
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
      }
    };

    fetchAddresses();
    fetchCart();
  }, [userId]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const actualTotal = cartItems.reduce((sum, item) => sum + item.product.actualPrice * item.quantity, 0);
  const saved = actualTotal - subtotal;
  const deliveryFee = subtotal > 500 ? 0 : 69;
  const platformFee = 5;
  const totalPayable = subtotal + deliveryFee + platformFee;

const confirmOrder = async () => {
  if (!selectedAddressId) {
    alert("Please select a delivery address.");
    return;
  }

  const address = addresses.find(addr => addr.id === parseInt(selectedAddressId));
  if (!address) return alert("Invalid address");

  const orders = cartItems.map(item => ({
    userId,
    productId: item.product.productId,
    sellerId: item.product.seller.sellerId,
    productName: item.product.productName,
    actualPrice: item.product.actualPrice,
    discountPrice: item.product.discountPrice,
    discountPercentage: item.product.discountPercentage,
    description: item.product.description,
    size: item.size,
    receiverName: address.name,
    phoneNumber: address.phoneNumber,
    address: address.address,
    city: address.city,
    district: address.district,
    state: address.state,
    pincode: address.pincode,
    status: "PENDING"
  }));

  console.log("Order payload to be sent:", orders);

  if (paymentMode === "cod") {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/place`, orders, {
      withCredentials: true,
    });
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${userId}`, {
  withCredentials: true,
});
setShowSuccess(true);
setTimeout(() => {
  window.location.href = "/orders";
}, 3000);


    return;
  }

  // ONLINE PAYMENT FLOW
  try {
    // 1. Create order on backend (amount in paise)
    const orderRes = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/payments/create-order`, {
      amount: Math.floor(totalPayable * 100),
    }, { withCredentials: true });

    const razorOrder = orderRes.data;

    // 2. Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your real Razorpay Key ID
      amount: razorOrder.amount,
      currency: "INR",
      name: "Your Store",
      description: "Product Purchase",
      order_id: razorOrder.id,
handler: async function (response) {
  console.log("Payment Success Response:", response);
  try {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/place`, orders, {
  withCredentials: true,
});

    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${userId}`, {
  withCredentials: true,
});
setShowSuccess(true);
setTimeout(() => {
  window.location.href = "/orders";
}, 3000);


  } catch (err) {
    console.error("Order place failed after payment:", err);
    alert("Order payment succeeded, but order save failed.");
  }
},

      prefill: {
        name: address.name,
        email: "customer@example.com",
        contact: address.phoneNumber,
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment or order placement failed", err);
    alert("Payment failed. Try again.");
  }
};



  if (!cartItems.length) {
    return <><Navbar/><div className="cart-empty">🛒 Your cart is empty.</div></>;
  }

  if (showSuccess) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column"
    }}>
      <DotLottieReact
        src="https://lottie.host/322d6e20-c7f9-415c-9d22-5d0d15d75856/FGv7vO0HqT.lottie"
        autoplay
        loop={false}
        style={{ width: "300px", height: "300px" }}
      />
      <h2 style={{ marginTop: "1rem", color: "#2e7d32" }}>Order Placed Successfully!</h2>
    </div>
  );
}


  return (
    <>
    <Navbar/>
    <div className="cart-modern-container">
      <div className="cart-modern-content">
        {/* Left Side - Cart Summary and Address */}
        <div className="cart-modern-items">
          <h2>Confirm Your Order</h2>

          {/* Address Selection */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4>Select Delivery Address:</h4>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", maxWidth: "500px" }}
            >
              <option value="">-- Select Address --</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name}, {addr.phoneNumber}, {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items Preview */}
          {cartItems.map((item) => (
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
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Summary and Payment */}
        <div className="cart-modern-summary">
          <h2>Price Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Math.floor(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
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

{/* Payment Method */}
<div style={{ marginTop: "1rem" }}>
  <h4 style={{ marginBottom: "0.5rem" }}>Payment Method:</h4>

  <div style={{ display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center" }}>
    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "1rem", cursor: "pointer" }}>
      <input
        type="radio"
        name="paymentMode"
        value="cod"
        checked={paymentMode === "cod"}
        onChange={() => setPaymentMode("cod")}
        style={{ margin: 0 }}
      />
      <span>Cash on Delivery</span>
    </label>

    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "1rem", cursor: "pointer" }}>
      <input
        type="radio"
        name="paymentMode"
        value="online"
        checked={paymentMode === "online"}
        onChange={() => setPaymentMode("online")}
        style={{ margin: 0 }}
      />
      <span>Online Payment</span>
    </label>
  </div>
</div>

          {/* Confirm Order */}
          <button className="place-order-btn" onClick={confirmOrder} style={{ marginTop: "1rem" }}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PlaceOrderPage;
