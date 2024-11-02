import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminHome.css'; 

const AdminHome = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="AdminHome-container">
        <div className="AdminHome-access-denied">
          <p>You do not have permission to view this page. Please log in as an admin.</p>
          <Link to="/login" className="AdminHome-btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const handleToggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <div className="AdminHome-container">
      <header className="AdminHome-header">
        <div className="AdminHome-header-content">
          <h1>Welcome, Admin {user.name}!</h1>
          <div className="AdminHome-profile">
            <button onClick={handleToggleDropdown} className="AdminHome-profile-btn">
              {user.name.charAt(0)}
            </button>
            {dropdownOpen && (
              <div className="AdminHome-dropdown">
                <button onClick={handleLogout} className="AdminHome-dropdown-item">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <section className="AdminHome-welcome-message">
        <p>This is the administration panel for managing Pochinki City's announcements and reports.</p>
      </section>
      <div className="AdminHome-tile-container">
        <div className="AdminHome-tile">
          <h2>Announcements</h2>
          <p>Manage and post city announcements.</p>
          <Link to="/announcements" className="AdminHome-btn-secondary">Manage Announcements</Link>
        </div>
        <div className="AdminHome-tile">
          <h2>Admin Panel</h2>
          <p>Access the admin panel for managing reports and user settings.</p>
          <Link to="/admin" className="AdminHome-btn-secondary">Go to Admin Panel</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
