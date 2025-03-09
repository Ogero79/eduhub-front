import React, { useState } from "react";
import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BuyMeCoffee = () => {
  const navigate = useNavigate();
  const mpesaNumber = "0759776864";
  const developerName = "Brian Ogero"; 
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mpesaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "24rem", textAlign: "center" }} className="p-4 shadow-lg">
        {/* Back Button */}
        <div className="d-flex justify-content-start">
          <Button variant="link" className="p-0" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }}></i>
          </Button>
        </div>

        <i className="bi bi-cup-hot text-warning mx-auto mb-3" style={{ fontSize: "2rem" }}></i>
        <Card.Title>Buy Me a Coffee ☕</Card.Title>
        <Card.Text>
          If you enjoy my work, consider sending a small donation via M-Pesa. Your support is greatly appreciated! 💛
        </Card.Text>

        <h5 className="text-muted">M-Pesa Number:</h5>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={mpesaNumber} readOnly />
          <Button variant={copied ? "success" : "primary"} onClick={handleCopy}>
            {copied ? <i className="bi bi-check"></i> : <i className="bi bi-clipboard"></i>} {copied ? "Copied!" : "Copy"}
          </Button>
        </InputGroup>

        <h6 className="text-success">Send to: {developerName}</h6>
      </Card>
    </Container>
  );
};

export default BuyMeCoffee;
