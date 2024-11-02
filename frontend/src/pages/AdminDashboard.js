import React, { useEffect, useState } from 'react';
import { getAllReports, getEmployees, assignReportToEmployee } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { useHistory } from 'react-router-dom'; 
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const { user } = useAuth(); 
  const [reports, setReports] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); 
  const [selectedReportIds, setSelectedReportIds] = useState([]); 
  const history = useHistory(); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports(); 
        console.log('Fetched reports data:', data); 
        data.forEach(report => {
          console.log('Report Details:', report);
        });
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        console.log('Fetched employees data:', data); 
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (user && user.role === 'admin') {
      fetchReports();
      fetchEmployees();
    }
  }, [user]);

  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false, 
      timeZone: 'Asia/Kolkata' 
    };
    return date.toLocaleString('en-IN', options);
  };

  const handleAssignReport = async () => {
    if (!selectedEmployeeId || selectedReportIds.length === 0) {
      console.error('Employee ID is missing or no report selected');
      return; 
    }
    
    try {
      for (const reportId of selectedReportIds) {
        await assignReportToEmployee(reportId, selectedEmployeeId);
      }
      setSelectedReportIds([]);
      setSelectedEmployeeId('');
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const handleReportSelection = (reportId) => {
    setSelectedReportIds((prevSelected) => {
      if (prevSelected.includes(reportId)) {
        return prevSelected.filter(id => id !== reportId);
      } else {
        return [...prevSelected, reportId];
      }
    });
  };

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
        default:
          history.push('/');
          break;
      }
    }
  };

  const sortedReports = reports.sort((a, b) => {
    const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="admin-dashboard">
      <h2 className="admin-h2">Admin Dashboard</h2>
      {user && user.role === 'admin' ? (
        <>
          <div className="admin-employee-selection">
            <label htmlFor="employee-select">Assign to Employee:</label>
            <select
              id="employee-select"
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              value={selectedEmployeeId}
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>

          <button className="admin-assign-button" onClick={handleAssignReport}>
            Assign Selected Reports
          </button>

          <h3>Reported Utility Issues</h3>
          <div className="admin-report-grid">
            {sortedReports.map(report => {
              let statusClass = '';
              if (!report.assignedEmployee && report.status === 'pending') {
                statusClass = 'admin-not-assigned-pending'; 
              } else if (report.assignedEmployee && report.status === 'pending') {
                statusClass = 'admin-assigned-pending'; 
              } else if (report.assignedEmployee && report.status === 'in-progress') {
                statusClass = 'admin-assigned-in-progress'; 
              } else if (report.assignedEmployee && report.status === 'completed') {
                statusClass = 'admin-assigned-completed'; 
              }

              if (selectedReportIds.includes(report._id)) {
                statusClass += ' admin-selected'; 
              }

              return (
                <div key={report._id} className={`admin-report-item ${statusClass}`}>
                  <input
                    type="checkbox"
                    checked={selectedReportIds.includes(report._id)}
                    onChange={() => handleReportSelection(report._id)}
                    className="admin-report-checkbox" /* Apply the new class */
                  />
                  <div className="report-info">
                    <strong>Type:</strong> {report.type} <br />
                    <strong>Status:</strong> <span>{report.status}</span><br />
                    <strong>Description:</strong>
                    <div className="admin-description-box">
                      {report.description}
                    </div>
                    <strong>Assigned to:</strong> 
                    <span>
                      {report.assignedEmployee ? 
                        employees.find(emp => emp._id === report.assignedEmployee)?.email || 'unassigned' 
                        : 'unassigned'}
                    </span>
                    <br />
                    <strong>Created At:</strong> {formatDateToIST(report.createdAt)} <br />
                    <strong>Last Updated:</strong> {formatDateToIST(report.updatedAt)} <br />

                    {/* Location details */}
                    <div>
                      <strong>Address:</strong> {report.location?.address}, {report.location?.city}, {report.location?.country} <br />
                      <strong>Postal Code:</strong> {report.location?.postalCode} <br />
                      <strong>Coordinates:</strong> [{report.location?.coordinates?.join(', ')}] <br />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="admin-unauthorized-message">
          <p>You do not have permission to view this dashboard.</p>
          <button className="admin-redirect-button" onClick={handleRedirect}>
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
