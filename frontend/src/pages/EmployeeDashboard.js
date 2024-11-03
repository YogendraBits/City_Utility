import React, { useState, useEffect } from 'react';
import { getAssignedReports, updateReportStatus } from '../api';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAssignedReports();
        console.log("Fetched reports:", data);
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
          history.push('/employee');
          break;
        case 'citizen':
          history.push('/');
          break;
        default:
          history.push('/');
      }
    } else {
      // If no user is found, redirect to login
      history.push('/login');
    }    
  };

  // Check for employee role and render accordingly
  if (user?.role !== 'employee') {
    return (
      <div className="emp-access-denied">
        <p>Access Denied: This page is for employees only.</p>
        <button className="emp-redirect-button" onClick={handleRedirect}>
          Leave
        </button>
      </div>
    );
  }

  // Sort reports by status
  const statusOrder = {
    pending: 1,
    'in-progress': 2,
    completed: 3,
  };

  const sortedReports = [...reports].sort((a, b) => {
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
  });

  return (
    <div className="emp-employee-dashboard">
      <header className="emp-header">
        <h2>Employee Dashboard</h2>
        <div className="emp-user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="emp-logout-button" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="emp-error-message">{error}</p>}
      {sortedReports.length === 0 ? (
        <p>No reports assigned to you.</p>
      ) : (
        <ul className="emp-report-list">
          {sortedReports.map((report) => (
            <li key={report._id} className={`emp-report-item emp-status-${report.status}`}>
              <div className="emp-report-info">
                <strong>Type:</strong> {report.type} <br />
                <strong>Status:</strong> {report.status} <br />
                <div className="emp-address-info">
                  <strong>Address:</strong> {report.location?.address} <br />
                  <strong>Postal Code:</strong> {report.location?.postalCode} <br />
                  <strong>Coordinates:</strong> [{report.location?.coordinates?.join(', ')}]
                </div>
                <div className="emp-description-box">
                  <strong>Description:</strong> <br />
                  {report.description}
                </div>
              </div>
              <div className="emp-report-actions">
                {report.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(report._id, 'in-progress')} className="emp-status-button">
                      Mark In Progress
                    </button>
                    <button onClick={() => handleStatusChange(report._id, 'completed')} className="emp-status-button">
                      Mark Completed
                    </button>
                  </>
                )}
                {report.status === 'in-progress' && (
                  <button onClick={() => handleStatusChange(report._id, 'completed')} className="emp-status-button">
                    Mark Completed
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeDashboard;
