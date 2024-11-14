import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await axios.get('http://localhost:5000/user/check', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
          withCredentials: true,
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
    fetchStudents();
  }, [navigate]);
  
  // Fetch students from the database
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token
      const response = await axios.get('http://localhost:5000/superadmin/students', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token here
        },
      });
      setStudents(response.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error fetching students');
    }
  };
  
  // Delete class rep function
  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token
      const response = await axios.delete(`http://localhost:5000/superadmin/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token here
        },
      });
      console.log(response.data); // Log the response (success message)
      
      // Remove the deleted resource from the state
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Error deleting student');
    }
  };
  

  return (
    <div className="d-flex">
      <Sidebar/>
    <div className="container">
      <h2>Super Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mt-4">

<h5>Students</h5>
        {students.length > 0 ? (
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
            {students.map((student, index) => (
              <tr key={student.id}>
                <th scope="row">{index + 1}</th>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>{student.semester}</td>
                <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(student.id)} // Trigger the delete on button click
                    >
                      Delete
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Students available</p>
      )}

      </div>
    </div>
    </div>
  );
};

export default StudentsList;
