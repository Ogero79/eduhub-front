import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

    const storedTheme = localStorage.getItem('theme') || 'light';
  const theme = storedTheme;

    useEffect(() => {
      document.body.className = theme; 
    }, [theme]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://ifund-backend.onrender.com/api/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`https://ifund-backend.onrender.com/api/notifications/${id}/mark-as-read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await axios.delete(`https://ifund-backend.onrender.com/api/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const groupByDate = (notifications) => {
    return notifications.reduce((acc, notification) => {
      const date = new Date(notification.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    }, {});
  };

  const groupedNotifications = groupByDate(notifications);

  return (
    <Container className="notifications-container mt-4">
      <Row>
        <Col>
  <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Notifications</h2>
  </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : Object.keys(groupedNotifications).length === 0 ? (
            <p className="text-center">No notifications to display.</p>
          ) : (
            Object.entries(groupedNotifications).map(([date, notifications]) => (
              <div key={date} className="mb-4">
                <h5 className="text-muted">{date}</h5>
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="mb-2"
                    style={{
                      backgroundColor: notification.is_read ? "#f8f9fa" : "#e8f5e9",
                      border: "none",
                      borderRadius: "10px",
                    }}
                  >
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            fontSize: "1.5rem",
                            marginRight: "15px",
                            color: notification.is_read ? "#6c757d" : "#11864E",
                          }}
                        >
                          {notification.is_read ? <FaCheckCircle /> : <FaBell />}
                        </div>
                        <div>
                          <Card.Text
                            className="mb-0"
                            style={{ fontWeight: notification.is_read ? "normal" : "bold" }}
                          >
                            {notification.message}
                          </Card.Text>
                          <small className="text-muted">
                            {new Date(notification.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                      </div>
                      <div>
                        {!notification.is_read && (
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;
