import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const AddClassRep = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          navigate('/login');
          return;
        }

        const response = await axios.get('https://eduhub-backend-huep.onrender.com/user/check', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.role !== 'superadmin') {
          navigate('/login');
        }
      } catch (err) {
        setError('Access denied.');
        navigate('/login');
      }
    };

    checkRole();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://eduhub-backend-huep.onrender.com/superadmin/assign-class-rep',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning class rep.');
    }
  };

  return (
    <div className='d-flex'>
      <Sidebar />
      <div className="register-container" style={{ background: '#f4f7fc', width: '100%' }}>
        <div className="register-card">
          <h2 className="register-title">Assign Class Rep</h2>
          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label>Email</label>
              <input
                type="email"
                className="register-form-control"
                placeholder="Enter student email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="register-btn-primary">
              Assign
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
