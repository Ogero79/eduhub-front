import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { years, semesters, genders, useCourses } from '../utils/constants';
import '../styles/Register.css'; 
import { Spinner } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" style={{width: "80px", height:"80px"}}/>
      </div>
    ); // Display loading spinner while data is being fetched
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Capitalize the first letter of first and last names
    const formattedFirstName = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    const formattedLastName = last_name.charAt(0).toUpperCase() + last_name.slice(1);
  
    // Password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const token = localStorage.getItem('token'); // Get the token
  
      const response = await axios.post('http://localhost:5000/register', {
        email,
        password,
        first_name: formattedFirstName,
        last_name: formattedLastName,
        year,
        semester,
        course,
        gender,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token here
        }
      });
  
      // If registration is successful, display success message and redirect
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering user');
      console.error('Error registering:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="register-form-row">
            <div className="register-form-group">
              <label>First Name</label>
              <input
                type="text"
                className="register-form-control"
                placeholder="Enter your first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="register-form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="register-form-control"
                placeholder="Enter your last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="register-form-row">
            <div className="register-form-group">
              <label>Year</label>
              <select
                className="register-form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                {years.map((item, index) => (
                  <option key={index} value={item?.value || item}>
                    {item?.label || `Year ${item}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="register-form-group">
              <label>Semester</label>
              <select
                className="register-form-control"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((item, index) => (
                  <option key={index} value={item?.value || item}>
                    {item?.label || `Semester ${item}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="register-form-group">
            <label>Gender</label>
            <select
              className="register-form-control"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select your gender</option>
              {genders.map((item, index) => (
                <option key={index} value={item?.value || item}>
                  {item?.label || item}
                </option>
              ))}
            </select>
          </div>
          <div className="register-form-group">
            <label>Course</label>
            <select
              className="register-form-control"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course, index) => (
                <option key={index} value={course?.id || course}>
                  {course?.name || course}
                </option>
              ))}
            </select>
          </div>
          <div className="register-form-row">
            <div className="register-form-group">
              <label>Email</label>
              <input
                type="email"
                className="register-form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="register-form-group">
              <label>Password</label>
              <input
                type="password"
                className="register-form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="register-form-group">
            <label>Repeat Password</label>
            <input
              type="password"
              className="register-form-control"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-btn-primary">Register</button>
        </form>
        {error && <div className="register-alert register-alert-danger mt-2">{error}</div>}
        {success && <div className="register-alert register-alert-success mt-2">{success}</div>}
        <div className="register-link mt-3">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
