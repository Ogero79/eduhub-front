import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner } from 'react-bootstrap';
import { FaRegUserCircle, FaGraduationCap, FaEnvelope } from 'react-icons/fa';
import StudentNavbar from "./StudentNavbar";
import AdminRepNavbar from "./AdminRepNavbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Store user role
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch the profile data based on role
    const fetchUserProfile = async (role) => {
      try {
        const token = localStorage.getItem('token'); // Get the token
  
        const response = await axios.get("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
          withCredentials: true, // Ensures cookies are sent with the request
        });
  
        // Set the user data to state
        setUserData(response.data);
      } catch (err) {
        // Handle error if the request fails
        setError('Failed to load profile data');
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };
  
    // Function to check role and fetch profile data
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
  
        const response = await axios.get("http://localhost:5000/user/check", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
          withCredentials: true, // Ensures session cookies are sent
        });
  
        const userRole = response.data.role;
        setRole(userRole); // Store the user role
  
        if (["admin", "classRep", "student"].includes(userRole)) {
          fetchUserProfile(userRole); // Fetch profile based on role
        } else {
          navigate("/login"); // Redirect to login if not authorized
        }
      } catch (err) {
        setError("Error verifying user role or user is not authorized");
        console.error(err);
        navigate("/login"); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify session and fetch role-specific profile
    checkRole();
  }, [navigate]);
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    ); // Display loading spinner while data is being fetched
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Display error message if fetch fails
  }

  const renderNavbar = () => {
    if (role === "admin" || role === "classRep") {
      return <AdminRepNavbar />; // Render admin/classRep navbar
    }
    if (role === "student") {
      return <StudentNavbar />; // Render student navbar
    }
    return null; // No navbar for unauthorized roles
  };


  return (
    <>
      {renderNavbar()} {/* Render navbar based on user role */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Your Profile</h2>

        {userData ? (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Card className="shadow-lg">
                <Card.Body>
                  <div className="text-center">
                    <FaRegUserCircle size={100} className="text-primary mb-3" />
                    <h3 className="card-title">{userData.firstName} {userData.lastName}</h3>
                  </div>
                  <div className="card-text">
                    <p>
                      <FaEnvelope /> <strong>Email:</strong> {userData.email}
                    </p>
                    {role !== "admin" && (
                      <>
                        <p>
                          <FaGraduationCap /> <strong>Course:</strong> {userData.course}
                        </p>
                        <p>
                          <strong>Year:</strong> {userData.year}
                        </p>
                        <p>
                          <strong>Semester:</strong> {userData.semester}
                        </p>
                      </>
                    )}
                    {role !== "student" && (
                      <>
                        <p>
                          <strong>Role:</strong> {role === "admin" ? "Administrator" : "Class Representative"}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    <Button variant="primary" onClick={() => navigate('/edit-profile')} className="mt-3">
                      Edit Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        ) : (
          <div>No profile data available</div> // Display if no user data is returned
        )}
      </div>
    </>
  );
};

export default Profile;
