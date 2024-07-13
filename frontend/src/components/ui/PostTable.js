import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import PostForm from "./PostTable";

const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSave = async (post) => {
    if (post.id) {
      await axios.post(`/posts/${post.id}`, post);
    } else {
      await axios.post("/posts", post);
    }
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`/posts/${id}`);
      fetchPosts();
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Posts</h1>
      <button onClick={() => openModal(null)}>Create Post</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.name}</td>
              <td>
                <button onClick={() => openModal(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PostForm
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSave={handleSave}
        initialData={selectedPost}
      />
    </div>
  );
};

export default PostTable;
