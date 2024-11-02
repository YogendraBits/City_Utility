import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Announcements from './pages/Announcements';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} exact />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/employee" component={EmployeeDashboard} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/submit-report" component={ReportForm} />
      <Route path="/my-reports" component={ReportList} />
    </Switch>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
