import React, { useEffect, useState } from 'react';
import { getAllReports, getEmployees, assignReportToEmployee, sendEmail } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { useHistory } from 'react-router-dom'; 
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const { user, logout } = useAuth(); 
  const [reports, setReports] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); 
  const [selectedReportIds, setSelectedReportIds] = useState([]); 
  const [sendEmailOption, setSendEmailOption] = useState(false); // Renamed state for email option
  const history = useHistory(); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports(); 
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
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
      const selectedEmployee = employees.find(emp => emp._id === selectedEmployeeId);
      if (!selectedEmployee) {
        console.error('Selected employee not found');
        return;
      }

      const updatedReports = reports.map(report => {
        if (selectedReportIds.includes(report._id)) {
          return {
            ...report,
            assignedEmployee: selectedEmployeeId,
          };
        }
        return report;
      });

      setReports(updatedReports);

      for (const reportId of selectedReportIds) {
        await assignReportToEmployee(reportId, selectedEmployeeId);
      }

      // Send email notification if the option is selected
      if (sendEmailOption) {
        await sendEmail({
          to: selectedEmployee.email,
          subject: 'Report Assignment Notification',
          data: `You have been assigned new reports. Report IDs: ${selectedReportIds.join(', ')}`
        });
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

  // Sort reports by status
  const sortedReports = reports.sort((a, b) => {
    const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="AdminDashboard-container">
      <header className="AdminDashboard-header">
        <h2 className="AdminDashboard-title">Admin Dashboard</h2>
        {user && (
          <div className="AdminDashboard-user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="AdminDashboard-logout-button" onClick={logout}>Logout</button>
          </div>
        )}
      </header>

      {user && user.role === 'admin' ? (
        <>
          <div className="AdminDashboard-employee-selection">
            <label htmlFor="employee-select">Assign to Employee:</label>
            <select
              id="employee-select"
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              value={selectedEmployeeId}
              className="AdminDashboard-select"
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>

            <div>
              <input 
                type="radio" 
                id="sendEmail" 
                name="emailOption" 
                value="send" 
                checked={sendEmailOption} 
                onChange={() => setSendEmailOption(true)} 
              />
              <label htmlFor="sendEmail">Send Email</label>

              <input 
                type="radio" 
                id="noEmail" 
                name="emailOption" 
                value="noSend" 
                checked={!sendEmailOption} 
                onChange={() => setSendEmailOption(false)} 
              />
              <label htmlFor="noEmail">Assign Without Sending Email</label>
            </div>

            <button className="AdminDashboard-assign-button" onClick={handleAssignReport}>
              Assign Selected Reports
            </button>
          </div>

          <h3 className="AdminDashboard-reports-title">Reported Utility Issues</h3>
          <div className="AdminDashboard-report-grid">
            {sortedReports.map(report => {
              let statusClass = '';
              if (!report.assignedEmployee && report.status === 'pending') {
                statusClass = 'AdminDashboard-not-assigned-pending'; 
              } else if (report.assignedEmployee && report.status === 'pending') {
                statusClass = 'AdminDashboard-assigned-pending'; 
              } else if (report.assignedEmployee && report.status === 'in-progress') {
                statusClass = 'AdminDashboard-assigned-in-progress'; 
              } else if (report.assignedEmployee && report.status === 'completed') {
                statusClass = 'AdminDashboard-assigned-completed'; 
              }

              if (selectedReportIds.includes(report._id)) {
                statusClass += ' AdminDashboard-selected'; 
              }

              return (
                <div key={report._id} className={`AdminDashboard-report-item ${statusClass}`}>
                  <input
                    type="checkbox"
                    checked={selectedReportIds.includes(report._id)}
                    onChange={() => handleReportSelection(report._id)}
                    className="AdminDashboard-report-checkbox"
                  />
                  <div className="AdminDashboard-report-info">
                    <strong>Type:</strong> {report.type} <br />
                    <strong>Status:</strong> <span>{report.status}</span><br />
                    <strong>Description:</strong>
                    <div className="AdminDashboard-description-box">
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
        <div className="AdminDashboard-unauthorized-message">
          <p>You do not have permission to view this dashboard.</p>
          <button className="AdminDashboard-redirect-button" onClick={handleRedirect}>
            Leave
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
