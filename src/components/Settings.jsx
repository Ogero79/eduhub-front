import React, { useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import StudentNavbar from "./StudentNavbar";
import BottomNav from "./BottomNav";

const Settings = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
    <StudentNavbar/>
    <div className="settings-page container container-fluid" style={{marginBottom:'100px'}}>
      <div className="profile-section d-flex align-items-center py-4 px-3 mb-4 bg-light rounded-3">
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            brian Ogero
          </h5>
          <p className="text-muted mb-0">computer</p>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleNavigation('/profile')}
        >
          View Full Profile
        </Button>
      </div>

      <div className="settings-list mt-4">
        <ListGroup variant="flush">
          <ListGroup.Item action onClick={() => handleNavigation('/account')}>
            <i className="bi bi-shield-lock me-3" style={{ fontSize: '1.2rem' }}></i>
            Account
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Manage account settings like email and password
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/theme')}>
            <i className="bi bi-palette me-3" style={{ fontSize: '1.2rem' }}></i>
            Theme
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Current theme: Light
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/notification-preferences')}>
            <i className="bi bi-bell me-3" style={{ fontSize: '1.2rem' }}></i>
            Notifications
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Set your notifications preferences
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/user/help')}>
            <i className="bi bi-question-circle me-3" style={{ fontSize: '1.2rem' }}></i>
            Help
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Get assistance or view FAQs
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/feedback')}>
            <i className="bi bi-chat-dots me-3" style={{ fontSize: '1.2rem' }}></i>
            Feedback
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Share your thoughts to help us improve
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/buy-me-coffee')}>
            <i className="bi bi-cup-hot me-3" style={{ fontSize: '1.2rem' }}></i>
            Buy me coffee
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Donate towards a good cause
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.2rem' }}></i>
            Log Out
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Sign out of your account
            </p>
          </ListGroup.Item>
        </ListGroup>
      </div>
      <BottomNav />
    </div>
    </>
  );
};

export default Settings;
