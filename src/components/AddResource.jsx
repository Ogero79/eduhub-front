import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { courses, years, semesters, resourceTypes } from '../utils/constants';
import AdminRepNavbar from './AdminRepNavbar';

const AddResource = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          navigate('/login');
          return;
        }

        // Make request with JWT token in the headers
        const response = await axios.get('https://eduhub-backend-huep.onrender.com/resource-adder/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { role, year, semester, course } = response.data;

        setRole(role);

        if (role === 'classRep') {
          setYear(year); // Auto-fill year for classRep
          setSemester(semester); // Auto-fill semester for classRep
          setCourse(course); // Auto-fill course for classRep
        }

        if (role === 'admin' && window.location.pathname.includes('/classrep')) {
          navigate('/admin/dashboard');
        } else if (role === 'classRep' && window.location.pathname.includes('/admin')) {
          navigate('/classrep/dashboard');
        } else if (role !== 'admin' && role !== 'classRep') {
          navigate('/login');
        }
      } catch (err) {
        setError('Error verifying user role or user is not logged in');
        console.error(err);
        navigate('/login');
      }
    };
    checkRole();
  }, [navigate]);

const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedUnitCode = unitCode.toUpperCase();
  
    // Define allowed file types and max file size (in bytes)
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // Add other allowed types if needed
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
  
    // Check if file is selected and if it's of allowed type and within size limit
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, PDF, and DOCX files are allowed.');
        setSuccessMessage('');
        return;
      }
  
      if (file.size > maxFileSize) {
        setError('File size exceeds 10MB limit.');
        setSuccessMessage('');
        return;
      }
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('course', course);
    formData.append('unitCode', formattedUnitCode);
    formData.append('resourceType', resourceType);
    
    if (file) {
      formData.append('file', file);
    }
  
  
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
  
      const url = role === 'admin' 
        ? 'https://eduhub-backend-huep.onrender.com/admin/add-resource'
        : 'https://eduhub-backend-huep.onrender.com/classrep/add-resource';
  
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Attach token to headers
        }
      });
  
      setSuccessMessage(response.data.message);
      setError('');
      
      setTitle('');
      setDescription('');
      setYear({year});
      setSemester({semester});
      setCourse({course});
      setUnitCode('');
      setResourceType('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to add resource. Please try again.');
      setSuccessMessage('');
    }
  };
  

  return (
    <>
      <AdminRepNavbar />
      <div className="container">
        <h2>Add Resource</h2>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Allow classRep to fill all fields, disable fields for classRep */}
          <div className="form-group">
            <label>Year</label>
            <select
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              disabled={role === 'classRep'} // Disable if classRep
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              className="form-control"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              disabled={role === 'classRep'} // Disable if classRep
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Course</label>
            <select
              className="form-control"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              disabled={role === 'classRep'} // Disable if classRep
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Unit Code</label>
            <input
              type="text"
              className="form-control"
              value={unitCode}
              onChange={(e) => setUnitCode(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Resource Type</label>
            <select
              className="form-control"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              required
            >
              <option value="">Select Resource Type</option>
              {resourceTypes.map((resourceType, index) => (
                <option key={index} value={resourceType}>
                  {resourceType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Resource File</label>
            <input
              type="file"
              className="form-control"
              ref={fileInputRef} 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Add Resource
          </button>
        </form>
      </div>
    </>
  );
};

export default AddResource;
