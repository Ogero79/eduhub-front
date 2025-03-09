import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import StudentNavbar from "./StudentNavbar";
import { useCourses, years, semesters } from "../utils/constants";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    course: "",
    year: "",
    semester: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { courses } = useCourses();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your profile.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setFormData(response.data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const capitalizeNames = (firstName, lastName) => {
    return {
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { firstName, lastName } = capitalizeNames(
      formData.firstName,
      formData.lastName
    );

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to update your profile.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/user/profile",
        { ...formData, firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setSuccess(response.data.message);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="container my-5">
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="p-0 me-3"
            style={{ color: "black" }}
          >
            <i className="bi bi-arrow-left back-btn" style={{ fontSize: "2rem" }}></i>
          </Button>
          <h2 className="mb-0">Edit Profile</h2>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleFormSubmit} className="shadow-lg p-4 rounded">
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Control
              as="select"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              required
            >
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              as="select"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            >
              {years.map((year, index) => (
                <option key={index} value={year}>Year {year}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Semester</Form.Label>
            <Form.Control
              as="select"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              required
            >
              {semesters.map((semester, index) => (
                <option key={index} value={semester}>Semester {semester}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditProfile;
