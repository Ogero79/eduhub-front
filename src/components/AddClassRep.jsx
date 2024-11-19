import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { courses, years, semesters, genders } from '../utils/constants';

const AddClassRep = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const [gender, setGender] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // List of courses
  useEffect(() => {
    const checkRole = async () => {
      try {
        // Retrieve the JWT token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Or sessionStorage if needed
  
        // If token is missing, set an error and redirect to login
        if (!token) {
          setError('Please log in to verify your role.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header to check the user's role
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/user/check', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
        });
  
        const { role } = response.data;
  
        // If user role is superadmin, allow access
        if (role !== 'superadmin') {
          navigate('/login'); // Redirect to login if not a superadmin
        }
      } catch (err) {
        setError('Error verifying user role or user is not a superadmin');
        console.error(err);
        navigate('/login'); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify the session
    checkRole();
  }, [navigate]);
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Capitalize the first letter of first and last names
    const formattedFirstName = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    const formattedLastName = last_name.charAt(0).toUpperCase() + last_name.slice(1);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://eduhub-backend-huep.onrender.com/superadmin/create-class-rep',
        {
          first_name: formattedFirstName,
          last_name: formattedLastName,
          email,
          year,
          semester,
          password,
          course,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token in the Authorization header
          },
        }
      );

      // If registration is successful, display success message
      setSuccess(response.data.message);

      // Clear the form fields after successful submission
      setFirstName('');
      setLastName('');
      setEmail('');
      setYear('');
      setSemester('');
      setPassword('');
      setCourse('');
    } catch (err) {
      setError(err.response.data.message || 'Error creating class representative');
      console.error('Error creating class rep:', err);
    }
  };

  return (
    <div className='d-flex'>
      <Sidebar />
      <div className="register-container" style={{ background: '#f4f7fc', width: '100%' }}>
        <div className="register-card">
          <h2 className="register-title">Add Class Rep</h2>
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
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      Year {year}
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
                  {semesters.map((semester, index) => (
                    <option key={index} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>
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
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
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
                {genders.map((gender, index) => (
                  <option key={index} value={gender}>
                    {gender}
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
            <button type="submit" className="register-btn-primary">
              Add Rep
            </button>
          </form>
          {error && <div className="register-alert register-alert-danger mt-2">{error}</div>}
          {success && <div className="register-alert register-alert-success mt-2">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddClassRep;
