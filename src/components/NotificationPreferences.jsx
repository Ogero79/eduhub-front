import React, { useState, useEffect} from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="container my-4 px-3">
                  <div className="d-flex align-items-center mb-4">
              <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{color:'black'}}>
              <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
              </Button>
              <h2 className="mb-0">Notification Prefernces</h2>
            </div>
      {success && <Alert variant="success">Notification preferences updated successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="emailNotifications">
          <Form.Check
            type="checkbox"
            label="Email Notifications"
            checked={notifications.emailNotifications}
            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
          />
        </Form.Group>
        <Form.Group controlId="pushNotifications">
          <Form.Check
            type="checkbox"
            label="Push Notifications"
            checked={notifications.pushNotifications}
            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default NotificationPreferences;
