import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ShowProduct from './components/ShowProduct';
import CategoryPage from './components/CategoryPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cart from './components/Cart';
import Profile from './components/Profile';
import PlaceOrderPage from './components/PlaceOrderPage';
import OrderDetails from './components/OrderDetails';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
      withCredentials: true,
    })
    .then(res => {
      setUser(res.data); // 👈 this should contain userId and useremail
    })
    .catch(err => {
      console.error("User not logged in", err);
      setUser(null);
    });
  }, []);

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ShowProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile user={user} />} /> {/* ✅ Pass user here */}
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/wishlist" element={<Wishlist user={user} />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
