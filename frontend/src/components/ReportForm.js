import React, { useState } from 'react';
import { createReport, getLocation } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './ReportForm.css'; // Ensure you have a CSS file for styles

const ReportForm = () => {
  const { user } = useAuth();
  const [type, setType] = useState('water');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for submission
  const [showPopup, setShowPopup] = useState(false); // State for showing the confirmation popup
  const history = useHistory(); // For redirecting

  // User role check
  if (!user || user.role !== 'citizen') {
    return (
      <div className="container mt-5">
        <p>You do not have permission to view this page. Please log in as a citizen.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting report...");

    if (!user) {
      setError('User not authenticated. Please log in.');
      console.error("Submission error: User not authenticated");
      return;
    }

    const reportData = {
      userId: user._id,
      type,
      description,
      location,
    };
    console.log("Report data to be submitted:", reportData); // Log report data

    setLoading(true); // Set loading state
    try {
      await createReport(reportData);
      setShowPopup(true); // Show the confirmation popup
      resetForm(); // Reset form after submission
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error submitting report');
      console.error("Error submitting report:", error); // Log error details
    } finally {
      setLoading(false); // Reset loading state
      console.log("Loading state set to false."); // Log loading state
    }
  };

  const resetForm = () => {
    setType('water');
    setDescription('');
    setLocation({
      address: '',
      city: '',
      postalCode: '',
      country: '',
      coordinates: [],
    });
    setError('');
    console.log("Form reset to initial state."); // Log form reset
  };

  const fetchLocation = async () => {
    console.log("Fetching location data...");
    try {
      const locData = await getLocation(); // Fetch location data from the backend

      const cleanedAddress = locData.address ? locData.address.replace(/^,/, '').trim() : '';
      const cityFromAddress = cleanedAddress.split(',').pop().trim(); // Assuming city is the last part

      setLocation({
        address: cleanedAddress, // Cleaned address
        city: cityFromAddress || '', // Extracted city
        postalCode: locData.postalCode || '',
        country: locData.country || '',
        coordinates: locData.coordinates || [], // Ensure coordinates are always an array
      });
      
      setError(''); // Clear error if successful
      console.log("Location data fetched successfully:", locData); // Log fetched location data
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error fetching location');
      console.error("Error fetching location:", error); // Log error details
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="report-form">
        <h2 className="report-form-title">Report Utility Issue</h2>
        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">Submitting your report...</p>} {/* Loading message */}

        <div className="form-section">
          <label>
            Issue Type:
            <select value={type} onChange={(e) => {
              setType(e.target.value);
              console.log("Issue type selected:", e.target.value); // Log selected issue type
            }} className="form-select">
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="waste">Waste Management</option>
            </select>
          </label>

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                console.log("Description updated:", e.target.value); // Log description change
              }}
              placeholder="Describe the issue..."
              required
              className="form-textarea"
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Street Address:
            <input
              type="text"
              value={location.address}
              placeholder="Street Address"
              readOnly
              className="form-input"
            />
          </label>

          <label>
            City:
            <input
              type="text"
              value={location.city}
              placeholder="City"
              readOnly
              className="form-input"
            />
          </label>

          <label>
            Postal Code:
            <input
              type="text"
              value={location.postalCode}
              placeholder="Postal Code"
              readOnly
              className="form-input"
            />
          </label>

          <label>
            Country:
            <input
              type="text"
              value={location.country}
              placeholder="Country"
              readOnly
              className="form-input"
            />
          </label>

          <div className="coordinates">
            <h4>Coordinates:</h4>
            {location.coordinates.length > 0 ? (
              <p>
                Latitude: {location.coordinates[1]}, Longitude: {location.coordinates[0]}
              </p>
            ) : (
              <p>No coordinates available</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={fetchLocation} className="fill-location-button">
            Fill Location
          </button>
          <button type="submit" className="submit-report-button" disabled={loading}> {/* Disable button while loading */}
            Submit Report
          </button>
        </div>
      </form>

      {/* Popup Confirmation */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Report Submitted</h3>
            <p>Your report has been submitted successfully.</p>
            <button onClick={() => history.push('/my-reports')} className="go-to-reports-button">
              Go to Reports
            </button>
            <button onClick={() => setShowPopup(false)} className="close-popup-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
