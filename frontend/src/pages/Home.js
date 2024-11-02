import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // Ensure your CSS file has styles for the layout

const Home = () => {
  const { user, logout } = useAuth(); // Assume logout is a function from AuthContext
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  // Check if user is not logged in or doesn't have the 'citizen' role
  if (!user || user.role !== 'citizen') {
    return (
      <div className="home-container mt-5">
        <p>You do not have permission to view this page. Please log in as a citizen.</p>
        <Link to="/login" className="home-btn btn-primary">Login</Link>
      </div>
    );
  }

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Close dropdown after logging out
  };

  return (
    <div className="home-container mt-5">
      <header className="home-header">
        <h1 className="home-welcome">Welcome, {user.name}!</h1>
        <div className="home-profile">
          <button onClick={handleToggleDropdown} className="home-profile-button">
            {user.name.charAt(0)} {/* Display initial letter */}
          </button>
          {dropdownOpen && (
            <div className="home-dropdown">
              <button onClick={handleLogout} className="home-dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </header>
      <section className="home-welcome-message">
        <p className="home-info-text">This is a reporting and information system for Pochinki City. Here, you can report utility issues and view community announcements.</p>
      </section>
      <div className="home-tile-container">
        <div className="home-tile">
          <h2>Report an Issue</h2>
          <p>Click below to report a utility issue.</p>
          <Link to="/submit-report" className="home-btn btn-secondary">Go to Report Form</Link>
        </div>
        <div className="home-tile">
          <h2>Your Reports</h2>
          <p>View your reported issues and track their status.</p>
          <Link to="/my-reports" className="home-btn btn-secondary">View Your Reports</Link>
        </div>
        <div className="home-tile">
          <h2>Announcements</h2>
          <p>Check out the latest announcements from Pochinki City.</p>
          <Link to="/announcements" className="home-btn btn-secondary">View Announcements</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
