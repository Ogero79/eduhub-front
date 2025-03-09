import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaRegUserCircle, FaGraduationCap, FaEnvelope } from "react-icons/fa";
import StudentNavbar from "./StudentNavbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ height: "80px", width: "80px" }}
        />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <StudentNavbar />
      <div className="container my-5">
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            onClick={() => navigate('/student/settings')}
            className="p-0 me-3"
            style={{ color: "black" }}
          >
            <i className="bi bi-arrow-left back-btn" style={{ fontSize: "2rem" }}></i>
          </Button>
          <h2 className="mb-0">Your Profile</h2>
        </div>

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
                    <p>
                      <FaGraduationCap /> <strong>Course:</strong> {userData.course}
                    </p>
                    <p>
                      <strong>Year:</strong> {userData.year}
                    </p>
                    <p>
                      <strong>Semester:</strong> {userData.semester}
                    </p>
                  </div>
                  <div className="text-center">
                    <Button
                      variant="primary"
                      onClick={() => navigate("/edit-profile")}
                      className="mt-3"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        ) : (
          <div>No profile data available</div>
        )}
      </div>
    </>
  );
};

export default Profile;
