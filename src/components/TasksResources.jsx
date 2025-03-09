import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

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
        backgroundColor: "#A5D8FF",
        color: "#003f88",
      };
    case "Past Paper":
      return {
        backgroundColor: "#FFEC99",
        color: "#856404",
      };
    case "Task":
      return {
        backgroundColor: "#A1E4B8",
        color: "#155724",
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

const TasksResources = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [resources, setResources] = useState([]);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
  
        const response = await axios.get(
          "https://eduhub-backend-huep.onrender.com/student/tasks-resources",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token here
            },
            withCredentials: true,
          }
        );
        setResources(response.data.resources || []);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Error fetching resources");
      }
    };
  
    fetchResources();
  }, []);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
  
        const response = await axios.get(
          "https://eduhub-backend-huep.onrender.com/user/check",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token here
            },
            withCredentials: true,
          }
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
    window.addEventListener("resize", handleResize);
    handleResize(); // To check screen size on initial render
  
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleCardClick = (resource) => {
    if (isSmallScreen && resource.file_url) {
      console.log("Downloading file from: ", resource.file_url); // Debugging
      const a = document.createElement("a");
      a.href = resource.file_url;
      a.download = resource.file_url.split('/').pop();;
      a.click();
    }
  };

  return (
    <div className="container">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingRight: '10%'}}>
        <h5>Tasks</h5>
        <a href="/all-tasks-resources"><button style={{background:'none',border:'none'}}>View all</button></a>
        </div>
      {resources.length > 0 ? (
        <div className="row gx-3 gy-2 flex-nowrap overflow-auto">
          {resources.map((resource) => (
            <div
              className="col-5 col-md-5 mb-3 col-lg-3 resource-container"
              key={resource.id}
              onClick={() => handleCardClick(resource)}
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="card-text">{resource.description}</p>
                    <p className="text-muted">{resource.unitcode}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        ...getResourceTypeDivStyle(resource.resource_type),
                        padding: "6px 12px",
                        borderRadius: "90px",
                        fontSize: "12px",
                      }}
                    >
                      {resource.resource_type}
                    </span>
                    <div
                      className="fileType"
                      style={{
                        ...getFileTypeTextStyle(resource.filetype),
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                    >
                      {resource.filetype}
                    </div>
                  </div>
                </div>
                <div
                  className="card-footer text-center"
                  style={{
                    backgroundColor: "transparent",
                    borderTop: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
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
      ) : (
        <p>No resources available</p>
      )}
    </div>
  );
};

export default TasksResources;
