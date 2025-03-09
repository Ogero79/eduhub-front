import React, { useState, useEffect } from "react";
import { ListGroup, Button, Modal, Form, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const [userDetails, setUserDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id } = response.data;
        setStudentId(id);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = userDetails;

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setTimeout(() => setError(null), 3000);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `https://eduhub-backend-huep.onrender.com/students/${studentId}/change-password`,
        {
          currentPassword,
          newPassword,
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
      setShowPasswordModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUserDetails({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `https://eduhub-backend-huep.onrender.com/superadmin/students/${studentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowDeleteModal(false);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process account deletion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4 px-3">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="p-0 me-3"
          style={{ color: "black" }}
        >
          <i
            className="bi bi-arrow-left back-btn"
            style={{ fontSize: "2rem" }}
          ></i>
        </Button>
        <h2 className="mb-0">Account Settings</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <ListGroup>
            <ListGroup.Item
              action
              onClick={() => setShowPasswordModal(true)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <i
                  className="bi bi-key me-3"
                  style={{ fontSize: "1.2rem" }}
                ></i>
                Change Password
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Update your password here
                </p>
              </div>
              <i
                className="bi bi-chevron-right"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => setShowDeleteModal(true)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <i
                  className="bi bi-trash me-3"
                  style={{ fontSize: "1.2rem" }}
                ></i>
                Delete Account
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Permanently delete your account
                </p>
              </div>
              <i
                className="bi bi-chevron-right"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={userDetails.currentPassword}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={userDetails.newPassword}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={userDetails.confirmPassword}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Change Password"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            className="ms-2"
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Account;
