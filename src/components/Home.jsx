import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-12 text-center p-4 shadow-lg rounded bg-white">
          <h1 className="display-4 text-primary">Welcome to EduHub</h1>
          <p className="lead text-muted">
            A place to access notes, past papers, and tasks. Join the learning community!
          </p>

          <div className="d-flex flex-column align-items-center">
            <Link to="/login" className="btn btn-primary btn-lg my-2 w-75">Login</Link>
            <Link to="/register" className="btn btn-success btn-lg my-2 w-75">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
