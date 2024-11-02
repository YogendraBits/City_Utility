// src/pages/ReportList.js
import React, { useEffect, useState } from 'react';
import { getReports, deleteReport } from '../api'; // Ensure deleteReport is imported
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ReportList.css';

const ReportList = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User role check
  if (!user || user.role !== 'citizen') {
    return (
      <div className="reportlist-container mt-5">
        <p>You do not have permission to view this page. Please log in as a citizen.</p>
        <Link to="/login" className="reportlist-login-button">Login</Link>
      </div>
    );
  }

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setError("You need to be logged in to view your reports.");
        setLoading(false);
        return;
      }

      try {
        const reportsData = await getReports();
        const userReports = reportsData.filter(report => report.userId === user._id);
        setReports(userReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  // Function to handle deletion of a report
  const handleDeleteReport = async (reportId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return; // Cancel deletion

    try {
      await deleteReport(reportId);
      // Update the reports state to remove the deleted report
      setReports(reports.filter(report => report._id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
      setError("Failed to delete the report.");
    }
  };

  // Function to sort reports by status
  const sortedReports = reports.sort((a, b) => {
    const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="reportlist">
      <h2 className="reportlist-title">Reported Utility Issues</h2>
      {loading && <p className="reportlist-loading">Loading reports...</p>}
      {error && <p className="reportlist-error">{error}</p>}
      {reports.length === 0 && !loading && <p className="reportlist-no-reports">No reports available.</p>}
      <div className="reportlist-grid">
        {sortedReports.map((report) => (
          <div key={report._id} className={`reportlist-item reportlist-status-${report.status}`}>
            <div className="reportlist-header">
              <div className="reportlist-type-status">
                <strong>Type:</strong> {report.type} <span className={`reportlist-status reportlist-status-${report.status}`}>Status: {report.status}</span>
              </div>
              <div className="reportlist-location">
                <strong>Location:</strong>
                <ul>
                  <li><strong>Address:</strong> {report.location?.address || 'N/A'}</li>
                  <li><strong>City:</strong> {report.location?.city || 'N/A'}</li>
                  <li><strong>Country:</strong> {report.location?.country || 'N/A'}</li>
                  <li><strong>Postal Code:</strong> {report.location?.postalCode || 'N/A'}</li>
                  <li><strong>Coordinates:</strong> {report.location?.coordinates ? report.location.coordinates.join(', ') : 'N/A'}</li>
                </ul>
              </div>
            </div>
            <div className="reportlist-description">
              <strong>Description:</strong>
              <div className="reportlist-description-box">
                {report.description}
              </div>
            </div>
            <button className="reportlist-delete-button" onClick={() => handleDeleteReport(report._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
