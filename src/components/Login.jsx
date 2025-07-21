// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import '../css/Auth.css';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
//           withCredentials: true,
//         });
//         navigate('/'); // Already logged in → redirect
//       } catch {
//         // Not authenticated → stay on login page
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, form, { withCredentials: true });
//       navigate('/');
//     } catch {
//       alert('Failed to login.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* Animation */}
//       <div className="auth-animation">
//         <DotLottieReact
//           src="https://lottie.host/76981064-895a-4a40-bfa9-e1fb1e0a2743/HKHJOhTTwR.lottie"
//           loop
//           autoplay
//         />
//       </div>

//       {/* Login Form */}
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           value={form.email}
//           onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           required
//           value={form.password}
//           onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
//         />
//         <button type="submit">Login</button>
//         <p>No account? <Link to="/register">Register</Link></p>
//       </form>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../css/Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking user authentication...");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, {
          withCredentials: true,
        });
        console.log("User is already authenticated:", res.data);
        navigate('/');
      } catch (error) {
        console.log("User not authenticated:", error?.response?.data || error.message);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Form submitted with:", form);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, form, {
        withCredentials: true,
      });
      console.log("Login successful:", response.data);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error?.response?.data || error.message);
      alert('Failed to login.');
    }
  };

  return (
    <div className="auth-container">
      {/* Animation */}
      <div className="auth-animation">
        <DotLottieReact
          src="https://lottie.host/76981064-895a-4a40-bfa9-e1fb1e0a2743/HKHJOhTTwR.lottie"
          loop
          autoplay
        />
      </div>

      {/* Login Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={e => {
            const val = e.target.value;
            setForm(prev => ({ ...prev, email: val }));
          }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={e => {
            const val = e.target.value;
            setForm(prev => ({ ...prev, password: val }));
          }}
        />
        <button type="submit">Login</button>
        <p>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
