import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import { Button, Spinner } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://eduhub-backend-huep.onrender.com/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const redirectTo = response.data.redirectTo;
        navigate(redirectTo);
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Error logging in:", err);
    } finally {
      setLoading(false);
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
            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-100 btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {/* Add a link to the registration page */}
        <div className="register-link mt-3">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
