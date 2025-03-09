import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";

const ResourcesList = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [resources, setResources] = useState([]); // Initialize as an empty array

  // Fetch the total number of resources and the list of resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/superadmin/resources', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
        });
        setResources(response.data.resources || []); // Safely handle undefined response data
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Error fetching resources');
      }
    };
  
    fetchResources();
  }, []);
  
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/user/check', {
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
  }, [navigate]);
  
  
  const deleteResource = async (resource_id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token
      const response = await axios.delete(`https://eduhub-backend-huep.onrender.com/resources/${resource_id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token here
        },
      });
      setResources(resources.filter(resource => resource.resource_id !== resource_id));
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError('Error deleting resource');
    }
  };
  


  return (
    <div className="d-flex">
      <Sidebar/>
    <div className="container">
      <h2>Super Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mt-4">

        {/* List resources */}
        <h5>Resources</h5>
        {resources.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => (
              <tr key={resource.resource_id}>
                <th scope="row">{index + 1}</th>
                <td>{resource.title}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteResource(resource.resource_id)} // Trigger the delete on button click
                    >
                      Delete
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No resources available</p>
      )}

      
      </div>
    </div>
    </div>
  );
};

export default ResourcesList;
