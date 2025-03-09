import { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Sidebar from "./Sidebar";
import axios from "axios";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses");
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses");
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName) return;
    try {
      const response = await axios.post("http://localhost:5000/courses", { course_name: newCourseName });
      setCourses([...courses, response.data]);
      setSuccessMessage("Course added successfully");
      setShowModal(false);
      setNewCourseName("");
    } catch (err) {
      setError("Failed to add course");
    }
  };

  const handleEditCourse = async () => {
    if (!newCourseName || !selectedCourse) return;
    try {
      await axios.put(`http://localhost:5000/courses/${selectedCourse.course_id}`, { course_name: newCourseName });
      setCourses(courses.map(course => course.course_id === selectedCourse.course_id ? { ...course, course_name: newCourseName } : course));
      setSuccessMessage("Course updated successfully");
      setShowModal(false);
      setEditMode(false);
      setNewCourseName("");
    } catch (err) {
      setError("Failed to update course");
    }
  };

  const handleDeleteCourse = async (course_id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${course_id}`);
      setCourses(courses.filter(course => course.course_id !== course_id));
      setSuccessMessage("Course deleted successfully");
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  return (
    <div className="d-flex p-4">
      <Sidebar />
      <div className="course-page w-100">
        <h2 className="mb-4">Manage Courses</h2>
        <Button className="mb-3" onClick={() => { setShowModal(true); setEditMode(false); }}>Add New Course</Button>
        <Table striped bordered hover className="course-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.course_name}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => { setEditMode(true); setSelectedCourse(course); setNewCourseName(course.course_name); setShowModal(true); }}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(course.course_id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? "Edit Course" : "Add New Course"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Enter course name"
                />
              </Form.Group>
            </Form>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={editMode ? handleEditCourse : handleAddCourse}>{editMode ? "Update Course" : "Add Course"}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CoursePage;
