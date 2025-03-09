import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Alert,
  Spinner,
  Modal,
  Form,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";

import StudentNavbar from "./StudentNavbar";
import BottomNav from "./BottomNav";
import axios from "axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [newPost, setNewPost] = useState({ description: "", file: null });
  const [editPost, setEditPost] = useState({ description: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("https://eduhub-backend-huep.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id, role, year, semester, courseId } = response.data;

        setYear(year);
        setRole(role);
        setSemester(semester);
        setStudentId(id);
        setCourseId(courseId);

        if (courseId && year && semester && id) {
          fetchFeeds(courseId, year, semester, id);
        }
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate, token]);

  const fetchFeeds = async (courseId, year, semester, studentId) => {
    if (!courseId || !year || !semester || !studentId) return;
    try {
      const response = await axios.get(
        `https://eduhub-backend-huep.onrender.com/feeds/${courseId}?year=${year}&semester=${semester}&studentId=${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeeds(response.data);
    } catch (err) {
      setError("Failed to load feeds.");
    } finally {
      setLoading(false);
    }
  };

  const refreshFeeds = () => fetchFeeds(courseId, year, semester, studentId);

  const handleReaction = async (feedId, action) => {
    try {
      const feed = feeds.find((f) => f.feed_id === feedId);
      if (!feed) return;

      if (
        (action === "like" && feed.userLiked) ||
        (action === "dislike" && feed.userDisliked)
      ) {
        alert(`You have already ${action}d this post.`);
        return;
      }

      const response = await axios.post(
        `https://eduhub-backend-huep.onrender.com/feeds/react`,
        { feedId, action, studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        refreshFeeds();
      }
    } catch (err) {
      console.error("Reaction failed:", err);
      alert("Failed to react.");
    }
  };

  const handleAddPost = async () => {
    if (!newPost.file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("description", newPost.description);
    formData.append("file", newPost.file);
    formData.append("courseId", courseId);
    formData.append("year", year);
    formData.append("semester", semester);

    try {
      setUploading(true);
      setUploadProgress(0);
      await axios.post("https://eduhub-backend-huep.onrender.com/feeds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      alert("Feed added successfully!");
      setShowAddPostModal(false);
      setUploadProgress(0);
      setUploading(false);
      setNewPost({ description: "", file: null });
      refreshFeeds();
    } catch (error) {
      console.error("Error adding feed:", error);
      alert("Failed to add feed.");
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `https://eduhub-backend-huep.onrender.com/feeds/${currentPost.feed_id}`,
        { description: editPost.description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Post updated successfully!");
      setShowEditPostModal(false);
      refreshFeeds();
    } catch (error) {
      console.error("Error updating feed:", error);
      alert("Failed to update post.");
    }
  };

  const handleDelete = async (feedId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://eduhub-backend-huep.onrender.com/feeds/${feedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setFeeds((prevFeeds) =>
          prevFeeds.filter((feed) => feed.feed_id !== feedId)
        );
      } else {
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
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
      <div className="container mt-4" style={{ marginBottom: "100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Feed</h2>
          {role === "classRep" && (
            <Button
              variant="link"
              className="d-flex align-items-center justify-content-center rounded-pill shadow-sm text-primary"
              style={{
                width: "140px",
                minWidth: "50px",
                height: "40px",
                border: "none",
              }}
              onClick={() => setShowAddPostModal(true)}
            >
              <i className="bi bi-plus-square fs-5"></i>
              <span className="ms-2 d-none d-sm-inline">Add Post</span>
            </Button>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {feeds.length > 0 ? (
          <div className="row">
            {feeds.map((feed) => (
              <div key={feed.feed_id} className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm">
                  <img
                    src={feed.image_path}
                    alt="Feed"
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                  <div className="card-body">
                    {/* Description with improved responsiveness */}
                    <p
                      className="text-muted mb-2 text-break d-none d-sm-block"
                      style={{ fontSize: "14px" }}
                    >
                      {feed.description}
                    </p>
                    <p
                      className="text-muted mb-2 text-break d-block d-sm-none"
                      style={{ fontSize: "16px" }} // Slightly larger for better readability on small screens
                    >
                      {feed.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <motion.i
                          className={`bi ${
                            feed.userliked
                              ? "bi-hand-thumbs-up-fill text-primary"
                              : "bi-hand-thumbs-up text-secondary"
                          }`}
                          onClick={() => handleReaction(feed.feed_id, "like")}
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          style={{
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                        ></motion.i>
                        <span>{feed.likes}</span>

                        <motion.i
                          className={`bi ${
                            feed.userdisliked
                              ? "bi-hand-thumbs-down-fill text-danger"
                              : "bi-hand-thumbs-down text-secondary"
                          }`}
                          onClick={() =>
                            handleReaction(feed.feed_id, "dislike")
                          }
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          style={{
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            marginLeft: "15px",
                          }}
                        ></motion.i>
                        <span>{feed.dislikes}</span>
                      </div>

                      {/* Class Rep Menu (Edit/Delete) */}
                      {role === "classRep" && (
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id={`dropdownMenu-${feed.feed_id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            ⋮
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenu-${feed.feed_id}`}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setEditPost({
                                    description: feed.description,
                                  });
                                  setCurrentPost(feed);
                                  setShowEditPostModal(true);
                                }}
                              >
                                ✏️ Edit Post
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(feed.feed_id)}
                              >
                                🗑️ Delete Post
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No feeds available</p>
        )}
      </div>
      <Modal show={showAddPostModal} onHide={() => setShowAddPostModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPost.description}
                onChange={(e) =>
                  setNewPost({ ...newPost, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewPost({ ...newPost, file: e.target.files[0] })
                }
              />
            </Form.Group>
            {uploading && (
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="mt-3"
              />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddPostModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPost}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Post"}
          </Button>
        </Modal.Footer>
      </Modal>
      ;{/* Edit Post Modal */}
      <Modal
        show={showEditPostModal}
        onHide={() => setShowEditPostModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editPost.description}
                onChange={(e) =>
                  setEditPost({ ...editPost, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditPostModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <BottomNav />
    </>
  );
};

export default Dashboard;
