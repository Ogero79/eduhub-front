import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import { Table, Button, Alert, Spinner, Modal, Form, Row, Col, Card } from "react-bootstrap";
import BottomNav from "./BottomNav";

const UnitsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addUnitLoading, setAddUnitLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [unitName, setUnitName] = useState("");
  const [unitCode, setUnitCode] = useState("");
  const [unitLecturer, setUnitLecturer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view the dashboard.");
          navigate("/login");
          return;
        }
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { role, year, semester, courseId, firstName } = response.data;
        setYear(year);
        setRole(role);
        setSemester(semester);
        setCourseId(courseId);
        setFirstName(firstName);
      } catch (err) {
        setError("Please log in to view the dashboard.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    if (!courseId || !year || !semester) return;

    const fetchUnits = async () => {
      try {
        const response = await axios.get(
          `https://eduhub-backend-huep.onrender.com/units/${courseId}?year=${year}&semester=${semester}`
        );
        setUnits(response.data);
      } catch (error) {
        setError("Failed to fetch units");
      }
    };

    fetchUnits();
  }, [courseId, year, semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unitData = {
      unit_name: unitName,
      unit_code: unitCode,
      lecturer: unitLecturer,
      year,
      semester,
      courseId,
    };

    setAddUnitLoading(true); // Start loading

    try {
      const response = await axios.post("https://eduhub-backend-huep.onrender.com/units", unitData);
      setUnits([response.data.unit, ...units]);
      setAddUnitLoading(false); 
      setSelectedUnitId(null);
      setUnitName("");
      setUnitCode("");
      setUnitLecturer("");
    } catch (error) {
      setError("Failed to save unit");
      setAddUnitLoading(false); // Stop loading even if there's an error
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUnitId(null);
    setUnitName("");
    setUnitCode("");
    setUnitLecturer("");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ height: "80px", width: "80px" }}
        />
      </div>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="container mt-4" style={{marginBottom:'100px'}}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="mb-0">Course Units</h2>
                  {role === "classRep" && (
                    <Button
                      variant="link"
                      className="d-flex align-items-center justify-content-center rounded-pill shadow-sm text-primary"
                      style={{
                        width: "140px",
                        minWidth: "50px",
                        height: "40px",
                        border: "none",
                        textDecoration:'none',
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-square fs-5"></i>
                      <span className="ms-2 d-none d-sm-inline">Add Unit</span>
                    </Button>
                  )}
                </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="g-2">
        {units.length > 0 ? (
  <ul className="list-group">
    {units
      .sort((a, b) => a.unit_code.localeCompare(b.unit_code)) // Sort units alphabetically by unit_code
      .map((unit) => (
        <li key={unit.unit_id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{unit.unit_name}</h5>
            <small className="text-muted">{unit.unit_code}</small>
          </div>
          <i 
            className="bi bi-arrow-right text-primary cursor-pointer" 
            style={{ fontSize: '20px' }} 
            onClick={() => navigate(`/unit/${unit.unit_id}`)}
          ></i>
        </li>
      ))}
  </ul>
) : (
  <p className="text-center">No units available</p>
)}

</Row>
     </div>
      <BottomNav/>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Unit Name</Form.Label>
              <Form.Control
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Unit Code</Form.Label>
              <Form.Control
                type="text"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Lecturer</Form.Label>
              <Form.Control
                type="text"
                value={unitLecturer}
                onChange={(e) => setUnitLecturer(e.target.value)}
                required
              />
            </Form.Group>
            <Button
      type="submit"
      variant="link"
      className="mt-3 d-flex align-items-center justify-content-center rounded-pill shadow-sm text-primary text-decoration-none"
      style={{
        width: "140px",
        minWidth: "50px",
        height: "40px",
        border: "none",
      }}
      onClick={handleSubmit}
      disabled={addUnitLoading} // Disable the button while loading
    >
      {addUnitLoading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <span className="d-sm-inline">Add Unit</span>
      )}
    </Button>

          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UnitsPage;
