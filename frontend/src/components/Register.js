import React, { useState } from 'react';
import { registerUser } from '../api'; // Ensure this API function is correctly implemented
import { useAuth } from '../context/AuthContext'; // Custom AuthContext for user state management
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import Modal from './Modal'; // Import the Modal component
import './Register.css'; // Import CSS for styling

const Register = () => {
  const { login } = useAuth(); // Get login from AuthContext
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const history = useHistory(); // Initialize history for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting registration with data:', formData); // Log the data being submitted

    setLoading(true); // Set loading state to true
    setError(''); // Reset any previous errors

    try {
      const response = await registerUser(formData); // Make API call to register user
      console.log('Response from registerUser:', response); // Log the entire response

      // Check if the response has the expected structure
      if (response.user) { // Now just check for user data
        login(response.user, response.token || ''); // Set user and token in context, use an empty string if token is not available
        console.log('Registration successful:', response); // Log successful registration

        // Show success modal
        setShowModal(true);
      } else {
        throw new Error('User data not found in response'); // Handle missing user data
      }
    } catch (err) {
      console.error('Error during registration:', err); // Log the entire error object
      if (err.response) {
        // If there's a response from the server
        setError(err.response.data.message); // Display the error message from the server
      } else {
        // Handle network errors or other unexpected errors
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    history.push('/login'); // Redirect to the login page
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error in red */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="citizen">Citizen</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      {/* Show the modal upon successful registration */}
      {showModal && (
        <Modal message="Registration Successful" onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Register;
