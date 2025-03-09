import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

const StudentNavbar = () => {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold text-primary fs-3 d-flex align-items-center" to="/">
          <span style={{ fontWeight: "700", fontSize: "1.8rem", letterSpacing: "1px" }}>Edu</span>
          <span style={{ color: "#6c757d", fontWeight: "300", fontSize: "1.8rem" }}>hub</span>
        </NavLink>

        {/* Notifications Icon */}
        <NavLink to="/notifications" className="text-dark">
        <i className="bi bi-bell fs-4"></i>
        </NavLink>
      </div>
    </nav>
  );
};

export default StudentNavbar;
