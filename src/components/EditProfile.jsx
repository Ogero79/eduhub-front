import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import StudentNavbar from "./StudentNavbar";
import AdminRepNavbar from "./AdminRepNavbar";
import { courses, years, semesters, resourceTypes } from '../utils/constants';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    course: "",
    year: "",
    semester: "",
  });
  const [course, setCourse] = useState(); // Available courses
  const [year, setYear] = useState(); // Available years
  const [semester, setSemester] = useState(''); // Available semesters
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // Store user role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user profile data
    const fetchUserProfile = async () => {
      try {
        // Retrieve the JWT token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Or sessionStorage if needed
  
        // If token is missing, set an error and redirect to login
        if (!token) {
          setError("Please log in to view your profile.");
          navigate("/login");
          return;
        }
  
        // Make the GET request to fetch user profile data, including the token in the Authorization header
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
          withCredentials: true,
        });
  
        // Pre-fill form with user data
        const { firstName, lastName, course, year, semester } = response.data;
        setFormData({ firstName, lastName, course, year, semester });
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
  
    // Function to check user role and fetch profile data
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
        // If token is missing, redirect to login
        if (!token) {
          setError("Please log in to verify your role.");
          navigate("/login");
          return;
        }
  
        // Verify the user role with the token in the Authorization header
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/user/check", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
          withCredentials: true, // Ensure cookies are sent with the request
        });
  
        const userRole = response.data.role;
        setRole(userRole); // Store the user role
  
        // Proceed with fetching the profile if role is valid
        if (["admin", "classRep", "student"].includes(userRole)) {
          fetchUserProfile(); // Fetch profile based on role
        } else {
          navigate("/login"); // Redirect to login if not authorized
        }
      } catch (err) {
        setError("Error verifying user role or user is not authorized");
        console.error(err);
        navigate("/login"); // Redirect to login if the request fails
      }
    };
  
    checkRole();
  }, [navigate]);
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Capitalize the first letter of firstName and lastName
  const capitalizeNames = (firstName, lastName) => {
    return {
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
    };
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    // Capitalize first and last names
    const { firstName, lastName } = capitalizeNames(formData.firstName, formData.lastName);
  
    // Prepare the data to send, remove course, year, semester for admin
    const updatedData = role === "admin" 
      ? { firstName, lastName } 
      : { firstName, lastName, course: formData.course, year: formData.year, semester: formData.semester };
  
    try {
      // Retrieve the JWT token from localStorage (or sessionStorage if needed)
      const token = localStorage.getItem('token'); // Or sessionStorage if you prefer
  
      // If token is missing, set an error and redirect to login
      if (!token) {
        setError("Please log in to update your profile.");
        navigate("/login");
        return;
      }
  
      // Make the PUT request to update the profile, including the token in the Authorization header
      await axios.put("https://eduhub-backend-huep.onrender.com/user/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token to the request
        },
        withCredentials: true,
      });
  
      setSuccess("Profile updated successfully.");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };
  
  // Render navbar based on user role
  const renderNavbar = () => {
    if (role === "admin" || role === "classRep") {
      return <AdminRepNavbar />; // Render admin/classRep navbar
    }
    if (role === "student") {
      return <StudentNavbar />; // Render student navbar
    }
    return null; // No navbar for unauthorized roles
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      {renderNavbar()} {/* Render navbar based on user role */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Edit Profile</h2>
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

          {role !== "admin" && (
            <>
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
                    <option key={index} value={course}>
                      {course}
                    </option>
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
                    <option key={index} value={year}>
                      Year {year}
                    </option>
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
                    <option key={index} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </>
          )}

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
