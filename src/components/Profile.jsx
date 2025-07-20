import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import Navbar from './Navbar';
import pincodeData from '../pincode_IN.json';

export default function Profile({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phoneNumber: '', address: '', city: '', district: '', state: '', pincode: '' });
  const [editingId, setEditingId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

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
      }
    };

    fetchUserAuth();
  }, []);

  useEffect(() => {
    if (!user?.userId) return;

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/addresses/user/${user.userId}`, { withCredentials: true })
      .then(res => setAddresses(res.data))
      .catch(err => console.error("Failed to fetch addresses", err));
  }, [user]);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     if (name === 'pincode') {
//       const pincode = value.trim();

// let allMatchedCities = [];
// let matchedState = '';
// let matchedDistrict = '';

// for (const state in pincodeData) {
//   for (const district in pincodeData[state]) {
//     const matchedCities = Object.entries(pincodeData[state][district]).filter(
//       ([city, pin]) => pin.trim() === pincode
//     ).map(([city]) => city.trim());

//     if (matchedCities.length > 0) {
//       allMatchedCities = [...allMatchedCities, ...matchedCities];
//       // Set state and district only once (take first match)
//       if (!matchedState && !matchedDistrict) {
//         matchedState = state.trim();
//         matchedDistrict = district.trim();
//       }
//     }
//   }
// }

// if (allMatchedCities.length > 0) {
//   setForm(f => ({
//     ...f,
//     state: matchedState,
//     district: matchedDistrict,
//     city: allMatchedCities[0] || ''
//   }));
//   setCityOptions([...new Set(allMatchedCities)]);
// } else {
//   setForm(f => ({ ...f, state: '', district: '', city: '' }));
//   setCityOptions([]);
// }




//     }
//   };



const handleChange = e => {
  const { name, value } = e.target;

  if (name === 'phoneNumber') {
    // Allow only digits and restrict to 10 digits
    if (!/^\d*$/.test(value) || value.length > 10) return;
  }

  if (name === 'pincode') {
    // Allow only digits and restrict to 6 digits
    if (!/^\d*$/.test(value) || value.length > 6) return;
  }

  setForm(prev => ({ ...prev, [name]: value }));

  if (name === 'pincode') {
    const pincode = value.trim();

    let allMatchedCities = [];
    let matchedState = '';
    let matchedDistrict = '';

    for (const state in pincodeData) {
      for (const district in pincodeData[state]) {
        const matchedCities = Object.entries(pincodeData[state][district]).filter(
          ([city, pin]) => pin.trim() === pincode
        ).map(([city]) => city.trim());

        if (matchedCities.length > 0) {
          allMatchedCities = [...allMatchedCities, ...matchedCities];
          if (!matchedState && !matchedDistrict) {
            matchedState = state.trim();
            matchedDistrict = district.trim();
          }
        }
      }
    }

    if (allMatchedCities.length > 0) {
      setForm(f => ({
        ...f,
        state: matchedState,
        district: matchedDistrict,
        city: allMatchedCities[0] || ''
      }));
      setCityOptions([...new Set(allMatchedCities)]);
    } else {
      setForm(f => ({ ...f, state: '', district: '', city: '' }));
      setCityOptions([]);
    }
  }
};




  const resetForm = () => {
    setForm({ name: '', phoneNumber: '', address: '', city: '', district: '', state: '', pincode: '' });
    setEditingId(null);
    setCityOptions([]);
  };

  const submit = () => {
    const payload = { ...form, user: { id: user.userId } };
    const req = editingId
      ? axios.put(`${process.env.REACT_APP_API_BASE_URL}/addresses/${editingId}`, payload, { withCredentials: true })
      : axios.post(`${process.env.REACT_APP_API_BASE_URL}/addresses`, payload, { withCredentials: true });

    req.then(() => {
      setShowForm(false);
      resetForm();
      return axios.get(`${process.env.REACT_APP_API_BASE_URL}/addresses/user/${user.userId}`, { withCredentials: true });
    }).then(res => setAddresses(res.data))
      .catch(err => console.error('Error saving address', err));
  };

  const remove = id => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/addresses/${id}`, { withCredentials: true })
      .then(() => setAddresses(addresses.filter(a => a.id !== id)))
      .catch(err => console.error('Error deleting address', err));
  };

  const edit = a => {
    setForm(a);
    setEditingId(a.id);

    // Load cities if a pincode is already present
    if (a.pincode) {
      const pincode = a.pincode.trim();
      for (const state in pincodeData) {
        for (const district in pincodeData[state]) {
          const matchedCities = Object.entries(pincodeData[state][district]).filter(
            ([city, pin]) => pin.trim() === pincode
          );

          if (matchedCities.length > 0) {
            const cities = matchedCities.map(([city]) => city.trim());
            setCityOptions(cities);
            return;
          }
        }
      }
    }

    setShowForm(true);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-left">
          <h2>Profile</h2>
          <p><strong>Email:</strong> {user.useremail}</p>
          <div className="btn-group">
            <button className="btn-add" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Address</button>
            <button className="btn-view" onClick={() => navigate('/orders')}>📦 View Orders</button>
            <button className="btn-view" onClick={() => navigate('/wishlist')}>💖 Wishlist</button>
          </div>
        </div>

        <div className="profile-right">
          {showForm ? (
            <div className="address-form">
              <h3>{editingId ? 'Edit Address' : 'New Address'}</h3>

              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

              <select name="city" value={form.city} onChange={handleChange}>
                <option value="">Select City</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <input name="district" placeholder="District" value={form.district} onChange={handleChange} readOnly />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} readOnly />

              <div className="form-actions">
                <button onClick={submit}>{editingId ? 'Update' : 'Save'}</button>
                <button onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="address-list">
              {addresses.map(a => (
                <div className="address-item" key={a.id}>
                  <div>
                    <p><strong>{a.name}</strong> | {a.phoneNumber}</p>
                    <p>{a.address}, {a.city}, {a.district}, {a.state} - {a.pincode}</p>
                  </div>
                  <div className="icons">
                    <span className="material-symbols-outlined" onClick={() => edit(a)}>edit</span>
                    <span className="material-symbols-outlined danger" onClick={() => remove(a.id)}>delete</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
