import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentNavbar from "./StudentNavbar";
import AdminRepNavbar from "./AdminRepNavbar";
import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

const ContactUs = () => {
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Store user role
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        // Retrieve the JWT token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Change to sessionStorage if needed
  
        // If token is missing, set an error and redirect to login
        if (!token) {
          setError('Please log in to verify your role.');
          navigate('/login');
          return;
        }
  
        // Send token in the Authorization header to check the user's role
        const response = await axios.get('http://localhost:5000/user/check', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the request
          },
        });
  
        const { role } = response.data;
  
        // If user role is admin, classRep, or student, set role state
        if (["admin", "classRep", "student"].includes(role)) {
          setRole(role); // Set the user role
        } else {
          navigate("/login"); // Redirect to login if unauthorized role
        }
      } catch (err) {
        setError("Error verifying user role or user is not authorized");
        console.error(err);
        navigate("/login"); // Redirect to login if the request fails
      }
    };
  
    // Call checkRole to verify the session and fetch the role
    checkRole();
  }, [navigate]);
  

  // Render appropriate navbar based on the role
  const renderNavbar = () => {
    if (role === "admin" || role === "classRep") {
      return <AdminRepNavbar />;
    }
    if (role === "student") {
      return <StudentNavbar />;
    }
    return null; // If role is undefined or invalid, don't show the navbar
  };

  return (
    <>
      {renderNavbar()} {/* Render navbar based on user role */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow p-4">
              <div className="card-body text-center">
                <p className="lead mb-4">Connect with us on social media!</p>

                <div className="social-icons d-flex flex-wrap justify-content-center mb-4">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/+254759776864"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={40} color="#25D366" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/ogero_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="Instagram"
                  >
                    <FaInstagram size={40} color="#E4405F" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="https://twitter.com/ogeroofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="X (Twitter)"
                  >
                    <FaTwitter size={40} color="#1DA1F2" />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/Ogero79"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="GitHub"
                  >
                    <FaGithub size={40} color="#333" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="LinkedIn"
                  >
                    <FaLinkedin size={40} color="#0077B5" />
                  </a>

                  {/* Email (Envelope Icon for Gmail) */}
                  <a
                    href="mailto:brianogero@kabarak.ac.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon mx-3 mb-3"
                    title="Email"
                  >
                    <FaEnvelope size={40} color="#D44638" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
