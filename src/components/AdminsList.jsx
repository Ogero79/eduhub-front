import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        // Retrieve JWT from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Change to sessionStorage if needed
  
        // If token is missing, redirect to login
        if (!token) {
          setError('Please log in to check your role.');
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
    fetchAdmins();
  }, [navigate]);
// Fetch admins from the database
const fetchAdmins = async () => {
  try {
    // Retrieve JWT from localStorage (or sessionStorage)
    const token = localStorage.getItem('token'); // Change to sessionStorage if needed

    // If token is missing, set an error and return
    if (!token) {
      setError('Please log in to fetch admins.');
      navigate('/login');
      return;
    }

    // Send token in the Authorization header
    const response = await axios.get('http://localhost:5000/superadmin/admins', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the JWT to the request
      },
    });
    setAdmins(response.data.admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    setError('Error fetching admins');
  }
};
// Delete admin function
const deleteAdmin = async (id) => {
  try {
    // Retrieve JWT from localStorage (or sessionStorage)
    const token = localStorage.getItem('token'); // Change to sessionStorage if needed

    // If token is missing, set an error and return
    if (!token) {
      setError('Please log in to delete admin.');
      navigate('/login');
      return;
    }

    // Send token in the Authorization header
    const response = await axios.delete(`http://localhost:5000/superadmin/admins/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the JWT to the request
      },
    });

    console.log(response.data); // Log the response (success message)

    // Remove the deleted admin from the state
    setAdmins(admins.filter(admin => admin.id !== id));
  } catch (error) {
    console.error('Error deleting admin:', error);
    setError('Error deleting admin');
  }
};
  

  return (
    <div className="d-flex">
      <Sidebar/>
    <div className="container">
      <h2>Super Admin Dashboard</h2>
      <button
          className="btn btn-secondary ms-3"
          onClick={() => navigate("/superadmin/create-admin")}
        >
          Add Admin
        </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mt-4">


<h5>Admins</h5>
        {admins.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id}>
                <th scope="row">{index + 1}</th>
                <td>{admin.first_name}</td>
                <td>{admin.last_name}</td>
                <td>{admin.email}</td>
                <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAdmin(admin.id)} // Trigger the delete on button click
                    >
                      Delete
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Admins available</p>
      )}

      </div>
    </div>
    </div>
  );
};

export default AdminsList;
