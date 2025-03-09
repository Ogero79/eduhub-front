import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Dashboard from './components/Dashboard'; // Regular user dashboard (student)
import Register from './components/Register';
import AddClassRep from './components/AddClassRep';
import StudentsList from './components/StudentsList';
import ClassRepsList from './components/ClassRepsList';
import ResourcesList from './components/ResourcesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Courses from './components/Courses';
import UnitDetails from './components/UnitDetails';
import UnitsPage from './components/UnitsPage';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import Account from './components/Account';
import Theme from './components/Theme';
import NotificationPreferences from './components/NotificationPreferences';
import Help from './components/Help';
import Feedback from './components/Feedback';
import BuyMeCoffee from './components/BuyMeCoffee';
import AddPost from './components/AddPost';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/superadmin/create-class-rep" element={<AddClassRep />} />
        <Route path="/superadmin/students" element={<StudentsList />} />
        <Route path="/superadmin/classreps" element={<ClassRepsList />} />
        <Route path="/superadmin/resources" element={<ResourcesList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/superadmin/courses" element={<Courses />} />
        <Route path="/unit/:unitId" element={<UnitDetails />} />
        <Route path="/student/units" element={<UnitsPage />} />
        <Route path="/student/calendar" element={<Calendar />} />
        <Route path="/student/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/account" element={<Account />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/notification-preferences" element={<NotificationPreferences />} />
        <Route path="/user/help" element={<Help />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/buy-me-coffee" element={<BuyMeCoffee />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
