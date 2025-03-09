import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/SuperAdminDashboard.css"; // Import the CSS file for custom styling

const SuperAdminDashboard = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [totalResources, setTotalResources] = useState(0);
  const [totalClassReps, setTotalClassReps] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFemaleStudents, setTotalFemaleStudents] = useState(0);
  const [totalMaleStudents, setTotalMaleStudents] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
  
        const resourcesRes = await axios.get("https://eduhub-backend-huep.onrender.com/superadmin/resources", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
        });
        setTotalResources(resourcesRes.data.totalResources);
  
        const classRepsRes = await axios.get("https://eduhub-backend-huep.onrender.com/superadmin/classreps", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
        });
        setTotalClassReps(classRepsRes.data.totalClassReps);
  
        const studentsRes = await axios.get("https://eduhub-backend-huep.onrender.com/superadmin/students", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token here
          },
        });
        setTotalStudents(studentsRes.data.totalStudents);
        setTotalFemaleStudents(studentsRes.data.totalFemaleStudents);
        setTotalMaleStudents(studentsRes.data.totalMaleStudents);
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/user/check", {
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
    <div className="superadmin-dashboard-wrapper">
      <Sidebar />
      <div className="superadmin-dashboard-container">
        <h2 className="superadmin-dashboard-title">Super Admin Dashboard</h2>
        {error && <div className="superadmin-alert superadmin-alert-danger">{error}</div>}
        <div className="superadmin-cards-container">
          <div className="superadmin-card">
            <div className="superadmin-card-header">
              <h5>Total Resources</h5>
            </div>
            <div className="superadmin-card-body">
              <strong>{totalResources}</strong>
            </div>
          </div>
          <div className="superadmin-card">
            <div className="superadmin-card-header">
              <h5>Total Class Reps</h5>
            </div>
            <div className="superadmin-card-body">
              <strong>{totalClassReps}</strong>
            </div>
          </div>
          <div className="superadmin-card">
            <div className="superadmin-card-header">
              <h5>Total Students</h5>
            </div>
            <div className="superadmin-card-body">
              <strong>{totalStudents}</strong>
            </div>
          </div>
          <div className="superadmin-card">
            <div className="superadmin-card-header">
              <h5>Total Female Students</h5>
            </div>
            <div className="superadmin-card-body">
              <strong>{totalFemaleStudents}</strong>
            </div>
          </div>
          <div className="superadmin-card">
            <div className="superadmin-card-header">
              <h5>Total Male Students</h5>
            </div>
            <div className="superadmin-card-body">
              <strong>{totalMaleStudents}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
