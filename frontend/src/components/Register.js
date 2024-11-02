import React, { useState } from 'react';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import Modal from './Modal';
import './Register.css';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);

      if (response.user) {
        login(response.user, response.token || '');
        setShowModal(true);
      } else {
        throw new Error('User data not found in response');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    history.push('/login');
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <p className="register-error-message">{error}</p>}
          <div className="register-field">
            <label htmlFor="name" className="register-label">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label htmlFor="email" className="register-label">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email"
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label htmlFor="password" className="register-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Create a Password"
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label htmlFor="role" className="register-label">Role</label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              value={formData.role}
              className="register-select"
            >
              <option value="citizen">Citizen</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {showModal && (
          <Modal message="Registration Successful!" onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Register;
