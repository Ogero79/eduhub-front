import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTachometerAlt, FaUserCog, FaUserTie, FaUsers, FaBook, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
      // Remove the token from localStorage (or sessionStorage/cookies)
      localStorage.removeItem("token");
    
      // Optionally, you can redirect the user to the login page
      window.location.href = "/login"; // Or use navigate('/login') if using React Router
    };
    
    
    // Check role
    useEffect(() => {
      const checkRole = async () => {
        try {
          const token = localStorage.getItem('token'); // Get the token
          const response = await axios.get("http://localhost:5000/user/check", {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token here
            },
            withCredentials: true,
          });
          if (response.data.role !== "superadmin") {
            navigate("/login");
          }
        } catch (err) {
          setError("Error verifying user role or user is not a superadmin");
          console.error(err);
          navigate("/login");
        }
      };
      checkRole();
    }, [navigate]);
    

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 ${
        isCollapsed ? 'collapsed' : ''
      }`}
      style={{ width: isCollapsed ? '80px' : '250px', height: '100vh'}}
    >
      <div style={{width: isCollapsed ? '80px' : '250px',position:'fixed',height: '100vh'}}       className={ "bg-dark text-white"}>
      <button
        className="btn btn-sm btn-light m-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '>' : '<'}
      </button>
      <h3 className={`text-center ${isCollapsed ? 'd-none' : ''}`}>SuperAdmin</h3>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto" style={{position:'fixed'}}>
        <li className="nav-item">
          <Link to="/superadmin" className="nav-link text-white">
          <FaTachometerAlt/>
            {!isCollapsed && <span className="ms-2">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/superadmin/admins" className="nav-link text-white">
          <FaUserCog/>
            {!isCollapsed && <span className="ms-2">Manage Admins</span>}
          </Link>
        </li>
        <li>
          <Link to="/superadmin/classreps" className="nav-link text-white">
          <FaUserTie/>
            {!isCollapsed && <span className="ms-2">Manage Class Reps</span>}
          </Link>
        </li>
        <li>
          <Link to="/superadmin/students" className="nav-link text-white">
            <FaUsers/>
            {!isCollapsed && <span className="ms-2">Manage Students</span>}
          </Link>
        </li>
        <li>
          <Link to="/superadmin/resources" className="nav-link text-white">
            <FaBook/>
            {!isCollapsed && <span className="ms-2">Manage Resources</span>}
          </Link>
        </li>
        <li>
        <Link className="nav-link text-white" onClick={handleLogout}>
        <FaSignOutAlt />
            {!isCollapsed && <span className="ms-2">Log Out</span>}
          </Link>
        </li>
      </ul>
      </div>
    </div>
  );
};

export default Sidebar;
