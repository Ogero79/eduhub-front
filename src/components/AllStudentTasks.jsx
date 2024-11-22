import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import StudentNavbar from "./StudentNavbar";
import { Card, Button, Spinner } from 'react-bootstrap';

// Style functions (same as before)
const getCardStyle = (resourceType) => {
  switch (resourceType) {
    case "Notes":
      return { backgroundColor: "#d0ebff", color: "#003f88" };
    case "Past Paper":
      return { backgroundColor: "#fff3cd", color: "#856404" };
    case "Task":
      return { backgroundColor: "#d4edda", color: "#155724" };
    default:
      return { backgroundColor: "#f8f9fa", color: "#6c757d" };
  }
};

const getResourceTypeDivStyle = (resourceType) => {
  switch (resourceType) {
    case "Notes":
      return {
        backgroundColor: "#A5D8FF", // Light Blue Darker
        color: "#003f88", // Dark Navy Text
      };
    case "Past Paper":
      return {
        backgroundColor: "#FFEC99", // Pale Yellow Darker
        color: "#856404", // Dark Brown Text
      };
    case "Task":
      return {
        backgroundColor: "#A1E4B8", // Light Green Darker
        color: "#155724", // Dark Green Text
      };
    default:
      return {};
  }
};

const getFileTypeTextStyle = (fileType) => {
  switch (fileType) {
    case "pdf":
      return { color: "#D32F2F", fontWeight: "bold" };
    case "doc":
    case "docx":
      return { color: "#1976D2", fontWeight: "bold" };
    case "ppt":
    case "pptx":
      return { color: "#FF9800", fontWeight: "bold" };
    case "txt":
      return { color: "#4CAF50", fontWeight: "bold" };
    default:
      return { color: "#6c757d", fontWeight: "bold" };
  }
};

const AllStudentPapers = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to handle screen width (for small screen detection)
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768); // Set small screen if width is less than 768px
  };

  // Add event listener to handle resize
  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Update on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Retrieve JWT from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Change to sessionStorage if needed
  
        // If token is missing, set an error and return
        if (!token) {
          setError('Please log in to fetch resources.');
          return;
        }
  
        // Send token in the Authorization header
        const response = await axios.get(
          "https://eduhub-backend-huep.onrender.com/student/all-tasks-resources",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT to the request
            },
          }
        );
  
        setResources(response.data.resources || []);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Error fetching resources");
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };
  
    fetchResources();
  }, []);

  // Check user role
  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://eduhub-backend-huep.onrender.com/user/check",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.role !== "student") {
          navigate("/login");
        }
      } catch (err) {
        setError("Error verifying user role or user is not a student");
        console.error(err);
        navigate("/login");
      }
    };

    checkRole();
  }, [navigate]);

  // Group resources by unitcode
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.unitcode]) {
      acc[resource.unitcode] = [];
    }
    acc[resource.unitcode].push(resource);
    return acc;
  }, {});

  // Download handler
  const handleCardClick = (resource) => {
    if (isSmallScreen && resource.file_url) {
      // Trigger file download on small screens
      const a = document.createElement("a");
      a.href = resource.file_url;
      a.download = resource.file_url.split('/').pop();;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    ); // Display loading spinner while data is being fetched
  }

  return (
    <>
      <StudentNavbar />
      <div className="container">
        <h5>All Tasks</h5>
        {Object.keys(groupedResources).length > 0 ? (
          Object.keys(groupedResources).map((unitcode) => (
            <div key={unitcode}>
              <h6>{unitcode}</h6>
              <div className="row gx-3 gy-2 flex-nowrap overflow-auto">
                {groupedResources[unitcode].map((resource) => (
                  <div
                    className="col-5 col-md-3 mb-3 resource-container"
                    key={resource.id}
                    onClick={() => handleCardClick(resource)} // Handle card click
                  >
                    <div
                      className="card h-100 shadow-sm"
                      style={{
                        ...getCardStyle(resource.resource_type),
                        borderRadius: "8px",
                        border: "none",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{resource.title}</h5>
                        <p className="card-text">{resource.description}</p>
                        <div className="fileType" style={getFileTypeTextStyle(resource.filetype)}>
                          {resource.filetype}
                        </div>
                      </div>
                      <div
                        className="card-footer text-center"
                        style={{ backgroundColor: "transparent", borderTop: "none" }}
                      >
                        <p className="text-muted">{moment(resource.created_at).fromNow()}</p>
                        <p className="download-resource">
                          {resource.file_url && !isSmallScreen && (
                            <a
                              href={resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm"
                              download
                            >
                              Download
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No resources available</p>
        )}
      </div>
    </>
  );
};

export default AllStudentPapers;
