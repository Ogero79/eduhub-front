import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";

const ClassRepsList = () => {
  const [classReps, setClassReps] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    const checkRole = async () => {
      try {
        // Retrieve JWT from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Change to sessionStorage if needed
  
        // If token is missing, set an error and redirect
        if (!token) {
          setError('Please log in to verify your role.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header
        const response = await axios.get('http://localhost:5000/user/check', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT to the request
          },
        });
  
        if (response.data.role !== 'superadmin') {
          navigate('/login'); // If not a superadmin, redirect to login page
        }
      } catch (err) {
        setError('Error verifying user role or user is not a superadmin');
        console.error(err);
        navigate('/login'); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify the session
    checkRole();
    fetchClassReps();
  }, [navigate]);
  
  // Fetch class representatives from the database
  const fetchClassReps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/superadmin/classreps', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT to request header
        },
      });
      setClassReps(response.data.classReps);
    } catch (err) {
      console.error('Error fetching class reps:', err);
      setError('Error fetching class representatives');
    }
  };
  
  // Delete class rep function
  const deleteClassRep = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/superadmin/classreps/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT to request header
        },
      });
      console.log(response.data); // Log the response (success message)
      
      // Remove the deleted class rep from the state
      setClassReps(classReps.filter(classRep => classRep.id !== id));
    } catch (error) {
      console.error('Error deleting class rep:', error);
      setError('Error deleting class rep');
    }
  };
  



  return (
    <div className="d-flex">
      <Sidebar/>
    <div className="container">
      <h2>Super Admin Dashboard</h2>
      <button
          className="btn btn-secondary ms-3"
          onClick={() => navigate("/superadmin/create-class-rep")}
        >
          Add Class Rep
        </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mt-4">


<h5>Class Representatives</h5>
        {classReps.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Course</th>
              <th scope="col">Year</th>
              <th scope="col">Semester</th>
            </tr>
          </thead>
          <tbody>
            {classReps.map((rep, index) => (
              <tr key={rep.id}>
                <th scope="row">{index + 1}</th>
                <td>{rep.first_name}</td>
                <td>{rep.last_name}</td>
                <td>{rep.email}</td>
                <td>{rep.course}</td>
                <td>{rep.year}</td>
                <td>{rep.semester}</td>
                <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteClassRep(rep.id)} // Trigger the delete on button click
                    >
                      Delete
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Class Representatives available</p>
      )}


      </div>
    </div>
    </div>
  );
};

export default ClassRepsList;
