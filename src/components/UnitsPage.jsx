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
    try {
      const response = await axios.post(
        "https://eduhub-backend-huep.onrender.com/units",
        unitData
      );
      setUnits([response.data.unit, ...units]);
      handleClose();
    } catch (error) {
      setError("Failed to save unit");
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
    units.map((unit) => (
      <Col key={unit.unit_id} xs={6} sm={6} md={4} lg={3}>
        <Card className="shadow-sm p-2 p-sm-3 rounded h-100 d-flex flex-column justify-content-between">
          <Card.Body className="d-flex flex-column align-items-start">
            <Card.Title className="fw-bold fs-6 fs-sm-5">{unit.unit_name}</Card.Title>
            <div className="d-flex justify-content-between w-100">
              <Card.Text className="text-muted fs-7 fs-sm-6">{unit.unit_code}</Card.Text>
              <i 
                className="bi bi-arrow-right text-primary cursor-pointer" 
                style={{ fontSize: '20px' }} 
                onClick={() => navigate(`/unit/${unit.unit_id}`)}
              ></i>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))
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
>
  <span className="d-sm-inline">Add Unit</span>
</Button>

          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UnitsPage;
