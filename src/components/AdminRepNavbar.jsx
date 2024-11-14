import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const AdminRepNavbar = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [role, setRole] = useState(null); // Store user's role (classRep, admin, etc.)

  useEffect(() => {
    // Fetch the user's role from the backend
    const checkUserRole = async () => {
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
        const response = await axios.get("http://localhost:5000/user/check", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT to the request
          },
        });
  
        setRole(response.data.role); // Set the role from the server response
      } catch (err) {
        setError("Failed to fetch user role.");
        console.error(err);
        navigate("/login"); // Redirect to login if error occurs
      }
    };
  
    checkUserRole();
  }, [navigate]);
  

    // Handle logout
    const handleLogout = () => {
      // Remove the token from localStorage (or sessionStorage/cookies)
      localStorage.removeItem("token");
    
      // Optionally, you can redirect the user to the login page
      window.location.href = "/login"; // Or use navigate('/login') if using React Router
    };
    
  // If user role is not admin or classRep, don't display the navbar
  if (role !== "admin" && role !== "classRep") {
    return null;
  }

  // Conditional navigation links
  const dashboardLink = role === "admin" ? "/admin/dashboard" : "/classrep/dashboard";
  const addResourceLink = role === "admin" ? "/admin/add-resource" : "/classrep/add-resource";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/src/assets/scre.png"
            alt="Logo"
            className="me-2"
            style={{ height: "40px" }}
          />
          <span className="fw-bold">EduHub</span>
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
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                to={dashboardLink} // Navigate to different dashboards based on role
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                to={addResourceLink} // Navigate to different add resource pages based on role
              >
                Add Resource
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

export default AdminRepNavbar;
