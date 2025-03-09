import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = ({ selectedUnit, selectedResource, onResourceChange }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="p-3">
      <Navbar.Brand as={Link} to="/">EduHub</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
          {selectedUnit && (
            <Nav.Link as={Link} to={`/unit/${selectedUnit.unit_id}`}>{selectedUnit.unit_name}</Nav.Link>
          )}
        </Nav>
        {selectedUnit && (
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              {selectedResource || "Select Resource"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['Notes', 'Papers', 'Tasks'].map((resource) => (
                <Dropdown.Item key={resource} onClick={() => onResourceChange(resource)}>
                  {resource}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
