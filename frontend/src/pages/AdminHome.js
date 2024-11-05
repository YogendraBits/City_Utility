import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminHome.css'; 

const AdminHome = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Check if user is not logged in or doesn't have the 'admin' role
    if (!user || user.role !== 'admin') {
      history.push('/login'); // Redirect to login page
    }
  }, [user, history]); // Dependency array includes user and history

  const handleToggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleProfileUpdate = () => {
    history.push('/profile/update'); // Navigate to Profile Update page
    setDropdownOpen(false); // Close dropdown after navigation
  };

  if (!user || user.role !== 'admin') {
    return null; // This part will never render because of the redirect in useEffect
  }

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
                <button onClick={handleProfileUpdate} className="AdminHome-dropdown-item">Profile Update</button>
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
          <p>Manage and post city announcements for public information.</p>
          <Link to="/announcements" className="AdminHome-btn-secondary">Manage Announcements</Link>
        </div>
        <div className="AdminHome-tile">
          <h2>Admin Panel</h2>
          <p>Access the admin panel for managing reports and user settings.</p>
          <Link to="/admin" className="AdminHome-btn-secondary">Go to Admin Panel</Link>
        </div>
        <div className="AdminHome-tile">
          <h2>Employee Management</h2>
          <p>Register or Remove employees to manage the city.</p>
          <Link to="/register_employee" className="AdminHome-btn-secondary">Manage Employee</Link>
        </div>
        <div className="AdminHome-tile">
          <h2>Archived Reports</h2>
          <p>View and manage archived reports for city documentation.</p>
          <Link to="/archived/reports" className="AdminHome-btn-secondary">View Archived Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
