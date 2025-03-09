import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const Notifications = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotification, setNewNotification] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { role, year, semester, courseId } = response.data;
        setYear(year);
        setRole(role);
        setSemester(semester);
        setCourseId(courseId);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    if (!courseId || !year || !semester) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://eduhub-backend-huep.onrender.com/notifications/${courseId}?year=${year}&semester=${semester}`
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [courseId, year, semester]);

  const groupByDate = (notifications) => {
    return notifications.reduce((acc, notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    }, {});
  };

  const handleAddNotification = async () => {
    if (!newNotification.trim()) return alert("Notification cannot be empty.");

    try {
      await axios.post("https://eduhub-backend-huep.onrender.com/notifications", {
        courseId,
        year,
        semester,
        notification: newNotification,
      });

      setNotifications([
        { notification: newNotification, created_at: new Date().toISOString() },
        ...notifications,
      ]);

      setNewNotification("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await axios.delete(`https://eduhub-backend-huep.onrender.com/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const groupedNotifications = groupByDate(notifications);

  return (
    <Container className="notifications-container mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
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
              <h2 className="mb-0">Notifications</h2>
            </div>

            {role === "classRep" && (
              <Button
                variant="link"
                className="d-flex align-items-center justify-content-center rounded-pill shadow-sm text-primary"
                style={{
                  width: "140px",
                  minWidth: "50px",
                  height: "40px",
                  border: "none",
                }}
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus-square fs-5"></i>
                <span className="ms-2 d-none d-sm-inline">
                  Add Notification
                </span>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : Object.keys(groupedNotifications).length === 0 ? (
            <p className="text-center">No notifications to display.</p>
          ) : (
            Object.entries(groupedNotifications).map(
              ([date, notifications]) => (
                <div key={date} className="mb-4">
                  <h5 className="text-muted">{date}</h5>
                  {notifications.map((notification, index) => (
                    <Card
                      key={index}
                      className="mb-2"
                      style={{
                        backgroundColor: "#f8f9fa",
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
                            color: "#11864E",
                          }}
                        >
                          <FaBell />
                        </div>
                        <div>
                          <Card.Text className="mb-0">
                            {notification.notification}
                          </Card.Text>
                          <small className="text-muted">
                            {new Date(
                              notification.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                        </div>
                        <div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <i className="bi bi-trash"></i> 
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )
            )
          )}
        </Col>
      </Row>

      {/* Modal for Adding Notification */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Notification Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddNotification}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Notifications;
