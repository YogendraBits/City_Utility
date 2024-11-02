import React, { useState, useEffect } from 'react';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import RegisterEmployeePopup from './RegisterEmployeePopup'; 
import './RegisterEmployee.css';

const RegisterEmployee = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // This effect runs on component mount
    setIsMounted(true);
    return () => {
      // Cleanup function that sets isMounted to false when unmounted
      setIsMounted(false);
    };
  }, []);

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
        setShowModal(true);
      } else {
        throw new Error('User data not found in response');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      if (isMounted) { // Only update state if component is still mounted
        setError(err.response ? err.response.data.message : 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    history.push('/AdminHome');
  };

  const handleAddMoreEmployees = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', role: 'employee' });
  };

  if (!user || user.role !== 'admin') {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="RegisterEmployee-container">
      <form onSubmit={handleSubmit} className="RegisterEmployee-form">
        <h2 className="RegisterEmployee-title">Register Employee</h2>
        {error && <p className="RegisterEmployee-error-message">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="RegisterEmployee-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="RegisterEmployee-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="RegisterEmployee-input"
        />
        <button type="submit" disabled={loading} className="RegisterEmployee-button">
          {loading ? 'Registering...' : 'Register Employee'}
        </button>
      </form>

      {showModal && (
        <RegisterEmployeePopup
          message="Employee Registration Successful"
          onClose={handleCloseModal}
          additionalActions={[
          ]}
        />
      )}
    </div>
  );
};

export default RegisterEmployee;
