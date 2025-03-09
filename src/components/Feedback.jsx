import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id } = response.data;
        setUserId(id);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "feedback") setFeedback(value);
    if (name === "email") setEmail(value);
  };

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/feedbacks",
        { userId, email, rating, feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      setRating(0);
      setFeedback("");
      setEmail("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to submit feedback. Please try again later.");
      }
      console.error("Feedback submission error:", error);
    }
  };

  return (
    <Container className="my-4 px-3">
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
        <h2 className="mb-0">Feedback</h2>
      </div>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="p-4 shadow-sm rounded">
            <Card.Body>
              <h4 className="mb-3">We value your feedback!</h4>
              <p className="text-muted">
                Your input helps us improve the platform.
              </p>

              <div className="mb-3">
                <Form.Label>Rate your experience</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      color={star <= rating ? "#FFD700" : "#ddd"}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address (Optional)</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="feedback"
                    value={feedback}
                    onChange={handleInputChange}
                    placeholder="Please share your feedback or suggestions"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Submit Feedback
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback;
