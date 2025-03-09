import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Help = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
    if (name === 'email') setEmail(value);
    if (name === 'message') setMessage(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:5000/support-messages',
        { userId, email, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message); 
      setEmail(''); 
      setMessage(''); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`); 
      } else {
        alert('Failed to send your message. Please try again later.'); 
      }
      console.error('Support message submission error:', error);
    }
  };
  

  return (
<Container className="my-4 px-3">
  <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Help</h2>
  </div>

  <Row className="mt-4">
    <Col md={6}>
      <h3>Frequently Asked Questions (FAQs)</h3>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I create an account?</Accordion.Header>
          <Accordion.Body>
            To create an account, click on the "Sign Up" button on the homepage and follow the instructions to enter your details.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>How can I reset my password?</Accordion.Header>
          <Accordion.Body>
            If you have forgotten your password, click on the "Forgot Password" link on the login page. You'll receive an email to reset your password.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I change my theme?</Accordion.Header>
          <Accordion.Body>
            You can change the theme by going to your settings page and toggling between light and dark mode.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>

    <Col md={6}>
      <h3>Contact Support</h3>
      <Card className="p-4 shadow-sm rounded">
        <Card.Body>
          <p>If you need further assistance, feel free to contact our support team. We'll get back to you as soon as possible!</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={message}
                onChange={handleInputChange}
                placeholder="Describe your issue or inquiry"
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Send Message
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  </Row>

  <Row className="mt-5">
    <Col>
      <h3>Resources</h3>
      <ul>
        <li>
          <a href="/user/guide" target="_blank" rel="noopener noreferrer">
            User Guide
          </a>
        </li>
        <li>
          <a href="/user/faq" target="_blank" rel="noopener noreferrer">
            Detailed FAQ
          </a>
        </li>
        <li>
          <a href="https://support.example.com" target="_blank" rel="noopener noreferrer">
            Visit Support Center
          </a>
        </li>
      </ul>
    </Col>
  </Row>
</Container>

  );
};

export default Help;
