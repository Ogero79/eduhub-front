import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // For success and error icons
import '../styles/CreateAdmin.css'; // Custom CSS for modern UI

const CreateAdmin = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Capitalize the first letter of the name
  const capitalizeFirstLetter = (value) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve the JWT token from localStorage (or sessionStorage)
      const token = localStorage.getItem('token'); // Or sessionStorage if needed
  
      // If token is missing, set an error and redirect to login
      if (!token) {
        setError('Please log in to create an admin.');
        navigate('/login');
        return;
      }
  
      // Make the POST request to create a new admin, including the token in the header
      const response = await axios.post(
        'https://eduhub-backend-huep.onrender.com/superadmin/create-admin',
        { firstName, lastName, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
          withCredentials: true,
        }
      );
  
      // Display success message and reset form fields
      setSuccessMessage(response.data.message);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setError(''); // Clear any previous error messages
  
    } catch (err) {
      setError('Error creating admin');
      console.error('Error creating admin:', err);
    }
  };

  useEffect(() => {
    const checkRole = async () => {
      try {
        // Retrieve the JWT token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Or sessionStorage if needed
  
        // If token is missing, set an error and redirect to login
        if (!token) {
          setError('Please log in to verify your role.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header to check the user's role
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/user/check', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
        });
  
        const { role } = response.data;
  
        // If user role is superadmin, allow access
        if (role !== 'superadmin') {
          navigate('/login'); // Redirect to login if not a superadmin
        }
      } catch (err) {
        setError('Error verifying user role or user is not a superadmin');
        console.error(err);
        navigate('/login'); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify the session
    checkRole();
  }, [navigate]);
  

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="create-admin-page">
        <div className="create-admin-form-container">
          <h2 className="create-admin-heading">Create Admin</h2>
          <form onSubmit={handleSubmit} className="create-admin-form">
            <div className="create-admin-form-group">
              <label className="create-admin-label">First Name</label>
              <input
                type="text"
                className="create-admin-input"
                value={firstName}
                onChange={(e) => setFirstName(capitalizeFirstLetter(e.target.value))}
                placeholder="Enter first name"
              />
            </div>

            <div className="create-admin-form-group">
              <label className="create-admin-label">Last Name</label>
              <input
                type="text"
                className="create-admin-input"
                value={lastName}
                onChange={(e) => setLastName(capitalizeFirstLetter(e.target.value))}
                placeholder="Enter last name"
              />
            </div>

            <div className="create-admin-form-group">
              <label className="create-admin-label">Email</label>
              <input
                type="email"
                className="create-admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div className="create-admin-form-group">
              <label className="create-admin-label">Password</label>
              <input
                type="password"
                className="create-admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="create-admin-btn">Create Admin</button>
          </form>

          {successMessage && (
            <div className="create-admin-alert create-admin-alert-success">
              <FaCheckCircle className="create-admin-alert-icon" />
              {successMessage}
            </div>
          )}

          {error && (
            <div className="create-admin-alert create-admin-alert-danger">
              <FaExclamationTriangle className="create-admin-alert-icon" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
