import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPost = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // Store user role
  const [newPost, setNewPost] = useState(""); // Store new post content
  const [posts, setPosts] = useState([]); // Store list of posts

  useEffect(() => {
    // Fetch user details
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleAddPost = () => {
    if (newPost.trim() === "") return;
    
    const postObject = {
      id: posts.length + 1,
      content: newPost,
      created_at: new Date().toISOString(),
    };

    setPosts([postObject, ...posts]); // Append new post to top
    setNewPost(""); // Clear input field
  };

  return (
    <Container className="mt-4">
      {/* Back Button */}
      <Button variant="link" className="p-0 mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }}></i>
      </Button>

      <Card className="p-4 shadow-lg">
        <Card.Title className="text-center">Class Feed</Card.Title>

        {/* Only ClassRep can add posts */}
        {role === "ClassRep" ? (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Add a Post</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write something..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" onClick={handleAddPost}>
                Post
              </Button>
            </Form>
          </>
        ) : (
          <p className="text-muted text-center">Only ClassReps can add posts.</p>
        )}
      </Card>

      {/* Display Posts */}
      <ListGroup className="mt-4">
        {posts.length === 0 ? (
          <p className="text-center text-muted">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <ListGroup.Item key={post.id} className="mb-2 p-3 shadow-sm">
              <p className="mb-1">{post.content}</p>
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
};

export default AddPost;
