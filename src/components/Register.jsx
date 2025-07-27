import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../css/Auth.css';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
          withCredentials: true,
        });
        navigate('/'); // Already logged in → redirect to home
      } catch {
        // Not logged in → stay on register page
      }
    };

    checkAuth();
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users`, form);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert('Registration failed. ' + (err.response?.data || ''));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-animation">
        <DotLottieReact
          src="https://lottie.host/fbc5e7a7-7be7-4855-a563-79f0c251e203/rDXn8EDNiC.lottie"
          loop
          autoplay
        />
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Register</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
