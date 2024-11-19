import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";

const StudentNavbar = () => {

  const navigate = useNavigate();  // Hook to navigate programmatically
  const [error, setError] = useState('');
  const [role, setRole] = useState(null); 
  

  // Handle logout
    const handleLogout = () => {
      // Remove the token from localStorage (or sessionStorage/cookies)
      localStorage.removeItem("token");
    
      // Optionally, you can redirect the user to the login page
      window.location.href = "/login"; // Or use navigate('/login') if using React Router
    };
    
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/user/check", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
          withCredentials: true, // Ensure session cookies are sent
        });
        setRole(response.data.role); // Set the role from the server response
        if (response.data.role !== "student") {
          navigate("/login"); // If not a student, redirect to login page
        }
      } catch (err) {
        setError("Error verifying user role or user is not a student");
        console.error(err);
        navigate("/login"); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify the session
    checkRole();
  }, [navigate]);
  

  // If user role is not admin or classRep, don't display the navbar
  if (role !== "student") {
    return null;
  }

  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <span className="fw-bold">EduHub</span>
          <sup>BETA</sup>
        </NavLink>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/all-notes-resources"
              >
                Notes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/all-papers-resources"
              >
                Papers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/all-tasks-resources"
              >
                Tasks
              </NavLink>
            </li>
          </ul>

          {/* Profile Dropdown (Far Right) */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profile
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    View Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/contact">
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
