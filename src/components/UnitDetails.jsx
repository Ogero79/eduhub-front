import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Dropdown,
  Card,
  Spinner,
  Nav,
  Button,
  Modal,
  Form,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const UnitDetails = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState("Notes");
  const [resources, setResources] = useState([]);
  const [units, setUnits] = useState([]);
  const [role, setRole] = useState("");
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [editedUnit, setEditedUnit] = useState({
    unit_name: "",
    unit_code: "",
    lecturer: "",
  });
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState(null);

  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    file: null,
    resource_type: "",
    unit_id: "",
  });
  const token = localStorage.getItem("token");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
  
        const [userResponse, unitResponse] = await Promise.all([
          axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://eduhub-backend-huep.onrender.com/units/details/${unitId}`),
        ]);
  
        const { role, year, semester, courseId } = userResponse.data;
  
        setYear(year);
        setRole(role);
        setSemester(semester);
        setCourseId(courseId);
        setUnit(unitResponse.data.unit);
        setResources(unitResponse.data.resources);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unitId, navigate]);
  
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
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
  
      const [userResponse, unitResponse] = await Promise.all([
        axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://eduhub-backend-huep.onrender.com/units/details/${unitId}`),
      ]);
  
      const { role, year, semester, courseId } = userResponse.data;
  
      setYear(year);
      setRole(role);
      setSemester(semester);
      setCourseId(courseId);
      setUnit(unitResponse.data.unit);
      setResources(unitResponse.data.resources);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditUnitSubmit = async () => {
    try {
      const updatedUnitData = {
        ...editedUnit,
        year,
        semester,
        courseId,
      };
  
      const response = await axios.put(
        `https://eduhub-backend-huep.onrender.com/units/${unitId}`,
        updatedUnitData
      );
  
      setUnit(response.data.unit);
      setShowEditUnitModal(false);
      fetchData(); // Refetch resources after editing a unit
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("Failed to update unit.");
    }
  };
  
  const handleAddResource = async () => {
    if (!newResource.file || !newResource.title) {
      alert("File and Title must be provided.");
      return;
    }
  
    if (newResource.file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB. Please select a smaller file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", newResource.title);
    formData.append("description", newResource.description);
    formData.append("file", newResource.file);
    formData.append("resource_type", selectedResource);
    formData.append("unitId", unitId);
  
    try {
      setUploading(true);
      setUploadProgress(0);
  
      await axios.post("https://eduhub-backend-huep.onrender.com/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
  
      alert("Resource added successfully!");
      setNewResource({ title: "", description: "", file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchData(); 
    } catch (error) {
      console.error("Error adding resource:", error);
      alert("Failed to add resource.");
    } finally {
      setUploadProgress(0);
      setUploading(false);
    }
  };
  


  const handleDeleteUnit = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this unit?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`https://eduhub-backend-huep.onrender.com/units/${unitId}`);
      alert("Unit deleted successfully!");
      navigate("/student/units");
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("Failed to delete unit.");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized access. Please log in.");
        return navigate("/login");
      }
  
      await axios.delete(`https://eduhub-backend-huep.onrender.com/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Resource deleted successfully!");
      
      // Refresh the resource list
      fetchData();
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource.");
    }
  };
  

  const getResourceIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <i className="bi bi-file-earmark-pdf text-danger fs-5 me-2"></i>;
      case "doc":
      case "docx":
        return (
          <i className="bi bi-file-earmark-word text-primary fs-5 me-2"></i>
        );
      case "xls":
      case "xlsx":
        return (
          <i className="bi bi-file-earmark-excel text-success fs-5 me-2"></i>
        );
      case "ppt":
      case "pptx":
        return (
          <i className="bi bi-file-earmark-ppt text-warning fs-5 me-2"></i>
        );
      default:
        return (
          <i className="bi bi-file-earmark-text text-secondary fs-5 me-2"></i>
        );
    }
  };

  const handleClick = (unitId) => {
    setLoading(true);
    navigate(`/unit/${unitId}`);
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

  const filteredResources = resources.filter(
    (res) => res.resource_type === selectedResource
  );

  return (
    <Container className="mt-5">
      <Nav variant="pills" className="justify-content-between mb-4">
        <Nav.Item>
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="link"
              onClick={() => navigate('/student/units')}
              className="p-0 me-3"
              style={{ color: "black" }}
            >
              <i
                className="bi bi-arrow-left back-btn"
                style={{ fontSize: "2rem" }}
              ></i>
            </Button>
            <h2 className="mb-0">Go back</h2>
          </div>
        </Nav.Item>
        <Nav.Item>
        <Dropdown>
  <Dropdown.Toggle variant="outline-primary">
    {unit?.unit_code || "Select Unit"}
  </Dropdown.Toggle>
  <Dropdown.Menu>
    {units
      .sort((a, b) => a.unit_code.localeCompare(b.unit_code)) // Sort units alphabetically by unit_code
      .map((u) => (
        <Dropdown.Item
          key={u.unit_id}
          onClick={() => handleClick(u.unit_id)}
        >
          {u.unit_code}
        </Dropdown.Item>
      ))}
  </Dropdown.Menu>
</Dropdown>

        </Nav.Item>
      </Nav>

      <Card className="shadow-lg p-5 rounded-lg">
        <h2 className="text-center mb-3 text-primary">
          {unit?.unit_name} ({unit?.unit_code})
        </h2>
        <h5 className="text-center text-muted mb-4">
          Lecturer: {unit?.lecturer}
        </h5>

        {role === "classRep" && (
  <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
    <Button
      variant="outline-warning"
      className="px-4 py-2 d-flex align-items-center gap-2"
      onClick={() => {
        setEditedUnit(unit);
        setShowEditUnitModal(true);
      }}
    >
      <i className="bi bi-pencil-square"></i> 
      <span className="d-none d-sm-inline"> Edit Unit</span> {/* Hide text on small screens */}
    </Button>

    <Button
      variant="outline-danger"
      className="px-4 py-2 d-flex align-items-center gap-2"
      onClick={handleDeleteUnit}
    >
      <i className="bi bi-trash"></i> 
      <span className="d-none d-sm-inline"> Delete Unit</span> {/* Hide text on small screens */}
    </Button>
  </div>
)}


<div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-4">
  <Dropdown>
    <Dropdown.Toggle variant="outline-secondary">
      {selectedResource}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {["Notes", "Papers", "Tasks"].map((resource) => (
        <Dropdown.Item
          key={resource}
          onClick={() => setSelectedResource(resource)}
        >
          {resource}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>

  {role === "classRep" && (
    <Button
      className="d-flex align-items-center justify-content-center rounded-pill shadow-sm text-primary text-decoration-none"
      type="submit"
      variant="link"
      style={{
        width: "140px",
        minWidth: "50px",
        height: "40px",
        border: "none",
      }}
      onClick={() => setShowAddResourceModal(true)}
    >
      Add {selectedResource}
    </Button>
  )}
</div>

        <div>
          <h4 className="text-muted text-center mb-4">{selectedResource}</h4>
          {filteredResources.length > 0 ? (
  <ul className="list-group">
{filteredResources.map((item, index) => (
  <li key={item.resource_id} className="list-group-item">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {getResourceIcon(item.link)}
        <div className="ms-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none fw-bold"
          >
            {item.title}
          </a>
        </div>
      </div>
      
      <button
        className="btn btn-sm btn-outline-secondary"
        data-bs-toggle="collapse"
        data-bs-target={`#resourceDetails${index}`}
        aria-expanded="false"
        aria-controls={`resourceDetails${index}`}
      >
        <i className="bi bi-chevron-down"></i> {/* Bootstrap icon */}
      </button>
    </div>

    {/* Collapsible Section */}
    <div className="collapse mt-2" id={`resourceDetails${index}`}>
      <p className="mb-1 text-muted small">{item.description}</p>
      <div className="d-flex justify-content-between">
        <a href={item.link} download className="btn btn-outline-primary btn-sm">
          <i className="bi bi-download"></i> Download
        </a>
        {role === "classRep" && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDeleteResource(item.resource_id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>
    </div>
  </li>
))}

  </ul>
) : (
  <p className="text-muted text-center">
    No {selectedResource.toLowerCase()} available.
  </p>
)}

        </div>
      </Card>

      <Modal
        show={showEditUnitModal}
        onHide={() => setShowEditUnitModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Unit Name</Form.Label>
              <Form.Control
                type="text"
                value={editedUnit.unit_name}
                onChange={(e) =>
                  setEditedUnit({ ...editedUnit, unit_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Unit Code</Form.Label>
              <Form.Control
                type="text"
                value={editedUnit.unit_code}
                onChange={(e) =>
                  setEditedUnit({ ...editedUnit, unit_code: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lecturer</Form.Label>
              <Form.Control
                type="text"
                value={editedUnit.lecturer}
                onChange={(e) =>
                  setEditedUnit({ ...editedUnit, lecturer: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEditUnitSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showAddResourceModal}
        onHide={() => setShowAddResourceModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add {selectedResource}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title Input */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newResource.title}
                onChange={(e) =>
                  setNewResource({ ...newResource, title: e.target.value })
                }
              />
            </Form.Group>

            {/* Description Input */}
            <Form.Group className="mb-3">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* File Upload Input */}
            <Form.Group className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                ref={fileInputRef} 
                onChange={(e) =>
                  setNewResource({ ...newResource, file: e.target.files[0] })
                }
              />
            </Form.Group>

            {/* Progress Bar */}
            {uploading && (
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                animated
                striped
                className="mt-3"
              />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddResourceModal(false)}
            disabled={uploading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddResource}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Resource"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UnitDetails;
