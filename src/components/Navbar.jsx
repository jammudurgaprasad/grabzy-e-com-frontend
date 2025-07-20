import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(search)}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch {
      alert('Logout failed');
    }
  };

  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    fetchUserAuth();
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="app-name">Grabzy</Link>
        </div>

        <div className="navbar-center">
          <form onSubmit={onSearch}>
            <input
              type="text"
              className="search-bar"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-icon desktop-only" title="Profile">
                <span className="material-icons">account_circle</span>
                <span className="nav-label desktop-label">Profile</span>
              </Link>

              <Link to="/cart" className="nav-icon desktop-only" title="Cart">
                <span className="material-icons">shopping_cart</span>
                <span className="nav-label desktop-label">Cart</span>
              </Link>

              <button className="nav-icon logout" title="Logout" onClick={handleLogout}>
                <span className="material-icons">logout</span>
                <span className="nav-label desktop-label">Logout</span>
              </button>
            </>
          ) : (
            <button className="nav-icon login" title="Login" onClick={() => navigate('/login')}>
              <span className="material-icons">login</span>
              <span className="nav-label desktop-label">Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Bottom nav for mobile */}
      <div className="mobile-bottom-nav mobile-only">
        <Link to="/" className="nav-icon" title="Home">
          <span className="material-icons">home</span>
          <span className="nav-label">Home</span>
        </Link>

        <Link to="/categories" className="nav-icon" title="Categories">
          <span className="material-icons">category</span>
          <span className="nav-label">Categories</span>
        </Link>

        <Link to="/profile" className="nav-icon" title="Profile">
          <span className="material-icons">account_circle</span>
          <span className="nav-label">Profile</span>
        </Link>

        <Link to="/cart" className="nav-icon" title="Cart">
          <span className="material-icons">shopping_cart</span>
          <span className="nav-label">Cart</span>
        </Link>
      </div>
    </>
  );
}
