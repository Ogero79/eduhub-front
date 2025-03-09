import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

  useEffect(() => {
    const lastSentTime = localStorage.getItem('resetEmailSentTime');
    if (lastSentTime) {
      const timePassed = (Date.now() - parseInt(lastSentTime, 10)) / 1000;
      if (timePassed < 300) {
        setResendDisabled(true);
        setCountdown(300 - timePassed);
      }
    }
  }, []);

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            localStorage.removeItem('resetEmailSentTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('https://eduhub-backend-huep.onrender.com/forgot-password', { email });
      setMessage('A password reset link has been sent to your email.');
      localStorage.setItem('resetEmailSentTime', Date.now().toString());
      setResendDisabled(true);
      setCountdown(300); // 5 minutes countdown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div className="d-flex justify-content-start">
                  <Button variant="link" className="p-0" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }}></i>
                  </Button>
                </div>
        <h2 className="text-center">Forgot Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 btn btn-primary" disabled={loading || resendDisabled}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : resendDisabled ? `Resend in ${Math.ceil(countdown)}s` : 'Send Reset Link'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
