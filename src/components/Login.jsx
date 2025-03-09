import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Import Link for navigation
import axios from 'axios';
import '../styles/Login.css'; // Import custom CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      // Send login request to the server with email and password
      const response = await axios.post(
        'http://localhost:5000/login', 
        { email, password },
        { withCredentials: true } // Ensures cookies are sent with the request
      );
  
      // If login is successful, save the JWT token
      if (response.data.token) {
        // Save JWT token to localStorage (or sessionStorage if you prefer)
        localStorage.setItem('token', response.data.token);
  
        // Display a message and redirect based on the role
        const redirectTo = response.data.redirectTo;
        navigate(redirectTo); // Redirect to appropriate dashboard
      }
    } catch (err) {
      // Display error message if login fails
      setError('Invalid email or password');
      console.error('Error logging in:', err);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
                    <div className="text-end mb-3">
                    <Link to="/forgot-password" style={{textDecoration:'none'}}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {/* Add a link to the registration page */}
        <div className="register-link mt-3">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
