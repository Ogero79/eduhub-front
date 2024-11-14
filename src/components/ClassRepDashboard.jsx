import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminRepNavbar from './AdminRepNavbar';

const ClassRepDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user info on mount (check if session is valid)
    const fetchUserInfo = async () => {
      try {
        // Retrieve JWT from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Change to sessionStorage if needed
  
        // If token is missing, set an error and redirect
        if (!token) {
          setError('Please log in to view the dashboard.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header
        const response = await axios.get('http://localhost:5000/classrep/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT to the request
          },
        });
  
        setMessage(response.data.message);
        setFirstName(response.data.message.split(',')[1].trim()); // Extract first name from the server response
      } catch (err) {
        setError('Please log in to view the dashboard.');
        console.error(err);
        navigate('/login'); // Redirect to login if not authorized
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

export default ClassRepDashboard;
