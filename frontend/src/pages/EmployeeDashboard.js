import React, { useState, useEffect } from 'react';
import { getAssignedReports, updateReportStatus } from '../api';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import './EmployeeDashboard.css'; // Import CSS for styles

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory(); // Initialize history for redirection

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAssignedReports(); // Fetch reports assigned to the logged-in user
        setReports(data);
      } catch (err) {
        console.error('Error fetching assigned reports:', err);
        setError('Error fetching assigned reports');
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const updatedReport = await updateReportStatus(reportId, newStatus);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? updatedReport : report
        )
      );
    } catch (err) {
      console.error('Error updating report status:', err);
      setError('Error updating report status');
    }
  };

  // Redirect function for unauthorized access
  const handleRedirect = () => {
    if (user) {
      switch (user.role) {
        case 'admin':
          history.push('/admin');
          break;
        case 'employee':
          // Already on the employee dashboard
          break;
        case 'citizen':
        default:
          history.push('/');
          break;
      }
    }
  };

  // Check for employee role and render accordingly
  if (user?.role !== 'employee') {
    return (
      <div className="emp-access-denied">
        <p>Access Denied: This page is for employees only.</p>
        <button className="emp-redirect-button" onClick={handleRedirect}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="emp-employee-dashboard">
      <h2>Employee Dashboard</h2>
      <div className="emp-user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {error && <p className="emp-error-message">{error}</p>}
      {reports.length === 0 ? (
        <p>No reports assigned to you.</p>
      ) : (
        <ul className="emp-report-list">
          {reports.map((report) => (
            <li key={report._id} className="emp-report-item">
              <div className="emp-report-info">
                <strong>Type:</strong> {report.type} <br />
                <div className="emp-description-box">
                  <strong>Description:</strong> <br />
                  {report.description}
                </div>
                <strong>Status:</strong> {report.status} <br />
              </div>
              <div className="emp-report-actions">
                <button onClick={() => handleStatusChange(report._id, 'in-progress')} className="emp-status-button">
                  Mark In Progress
                </button>
                <button onClick={() => handleStatusChange(report._id, 'completed')} className="emp-status-button">
                  Mark Completed
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeDashboard;
