import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import AdminRepNavbar from './AdminRepNavbar';

const AdminDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user info on mount (check if session is valid)
    const fetchUserInfo = async () => {
      try {
        // Retrieve JWT from localStorage (or sessionStorage depending on where you store it)
        const token = localStorage.getItem('token'); // Change this to sessionStorage if using session storage
  
        // If token doesn't exist, redirect to login
        if (!token) {
          setError('Please log in to view the dashboard.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT to the request
          },
        });
  
        // Assuming response contains the message with the user's first name
        setFirstName(response.data.message.split(',')[1].trim()); // Extract first name from the server response
        setMessage(response.data.message); 
      } catch (err) {
        setError('Please log in to view the dashboard.');
        navigate('/login'); // Redirect to login if not authorized or token is invalid
      }
    };
  
    fetchUserInfo();
  }, [navigate]);
  

  return (
    <>
    <AdminRepNavbar/>
    <div className="container mt-5">
      <h2>Welcome to the Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {firstName && (
        <div className="alert alert-success">
          <h4>Hello,</h4>
          <p>{message}</p>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminDashboard;
