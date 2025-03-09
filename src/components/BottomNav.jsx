import React from "react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav
      className="fixed-bottom bg-white d-flex justify-content-around py-2 shadow-lg"
      style={{ borderTop: "1px solid #ddd" }}
    >
      <Link to="/dashboard" className="text-dark text-center">
        <i className="bi bi-house-door fs-4"></i>
      </Link>
      <Link to="/student/units" className="text-dark text-center">
        <i className="bi bi-book fs-4"></i>
      </Link>
      <Link to="/student/calendar" className="text-dark text-center">
        <i className="bi bi-calendar fs-4"></i>
      </Link>
      <Link to="/student/settings" className="text-dark text-center">
        <i className="bi bi-gear fs-4"></i>
      </Link>
    </nav>
  );
};

export default BottomNav;
