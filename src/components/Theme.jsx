import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Theme = () => {
  const navigate = useNavigate();

  return (
    <Container className="my-4 px-3">
      <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
        <h2 className="mb-0">Theme Settings</h2>
      </div>
      <div className="communities-page-container container-fluid py-4 px-3 px-md-4 px-lg-5 flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{marginBottom:'100px'}}>
      <div className="flex flex-col items-center text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Theme Feature Coming Soon!</h2>
          <p className="text-gray-600 mb-4">We are working hard to bring you this amazing feature. Stay tuned for updates!</p>
      </div>
      </div>
    </Container>
  );
};

export default Theme;
