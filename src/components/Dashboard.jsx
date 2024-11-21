import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import StudentNavbar from './StudentNavbar';
import RecentResources from './RecentResources';
import NotesResources from './NotesResources';
import PapersResources from './PapersResources';
import TasksResources from './TasksResources';

const Dashboard = () => {
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
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/dashboard', {
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
  <StudentNavbar/>
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
        <div className="alert alert-success">
          <h4>Hello,</h4>
          <p>{message}</p>
        </div>
      <RecentResources/>
      <NotesResources/>
      <PapersResources/>
      <TasksResources/>
    </div>
    </>
  );
};

export default Dashboard;
