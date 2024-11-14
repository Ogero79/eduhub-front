import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Dashboard from './components/Dashboard'; // Regular user dashboard (student)
import Register from './components/Register';
import CreateAdmin from './components/CreateAdmin';
import AddClassRep from './components/AddClassRep';
import AddResource from './components/AddResource';
import ClassRepDashboard from './components/ClassRepDashboard';
import AdminDashboard from './components/AdminDashboard';
import StudentsList from './components/StudentsList';
import AdminsList from './components/AdminsList';
import ClassRepsList from './components/ClassRepsList';
import ResourcesList from './components/ResourcesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AllStudentNotes from './components/AllStudentNotes';
import AllStudentPapers from './components/AllStudentPapers';
import AllStudentTasks from './components/AllStudentTasks';
import Profile from './components/Profile';
import ContactUs from './components/ContactUs';
import EditProfile from './components/EditProfile'
import CheckToken from './components/CheckToken';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/classrep/dashboard" element={<ClassRepDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/superadmin/create-admin" element={<CreateAdmin />} />
        <Route path="/superadmin/create-class-rep" element={<AddClassRep />} />
        <Route path="/admin/add-resource" element={<AddResource />} />
        <Route path="/superadmin/add-resource" element={<AddResource />} />
        <Route path="/classrep/add-resource" element={<AddResource />} />
        <Route path="/superadmin/students" element={<StudentsList />} />
        <Route path="/superadmin/admins" element={<AdminsList />} />
        <Route path="/superadmin/classreps" element={<ClassRepsList />} />
        <Route path="/superadmin/resources" element={<ResourcesList />} />
        <Route path="/all-notes-resources" element={<AllStudentNotes />} />
        <Route path="/all-papers-resources" element={<AllStudentPapers />} />
        <Route path="/all-tasks-resources" element={<AllStudentTasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/check" element={<CheckToken />} />

      </Routes>
    </Router>
  );
};

export default App;
