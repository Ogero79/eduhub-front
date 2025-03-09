import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const lastResendTime = localStorage.getItem('resetResendTime');
    if (lastResendTime) {
      const timePassed = (Date.now() - parseInt(lastResendTime, 10)) / 1000;
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
            localStorage.removeItem('resetResendTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  // Handle password reset form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    setShowResend(false);

    try {
      await axios.post(`http://localhost:5000/reset-password/${token}`, { password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password.';
      setError(errorMsg);

      // Show "Resend Reset Link" button if token is expired
      if (errorMsg.toLowerCase().includes('expired')) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resend reset link
  const handleResendResetLink = async () => {
    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(`http://localhost:5000/resend-reset-link`, { token });
      setMessage('A new reset link has been sent to your email.');
      setShowResend(false);
      setResendDisabled(true);
      localStorage.setItem('resetResendTime', Date.now().toString());
      setCountdown(300); // 5 minutes countdown
    } catch (err) {
      setError('Failed to resend reset link. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 className="text-center">Reset Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {showResend && (
          <Button
            variant="warning"
            className="w-100 mb-3"
            onClick={handleResendResetLink}
            disabled={resendLoading || resendDisabled}
          >
            {resendLoading ? <Spinner as="span" animation="border" size="sm" /> : resendDisabled ? `Resend in ${Math.ceil(countdown)}s` : 'Resend Reset Link'}
          </Button>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 btn btn-primary" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Reset Password'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
