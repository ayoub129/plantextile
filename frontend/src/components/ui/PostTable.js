import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [newPost, setNewPost] = useState({ name: "" });
  const [updatePost, setUpdatePost] = useState({ name: "" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      toast.error("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await api.post("/posts", newPost);
      setPosts([...posts, response.data]);
      toast.success("Post created successfully");
      setShowModal(false);
      setNewPost({ name: "" });
    } catch (error) {
      toast.error("Error creating post.");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post(`/posts/${postToUpdate.id}`, updatePost);
      setPosts(
        posts.map((post) =>
          post.id === postToUpdate.id ? response.data : post
        )
      );
      toast.success("Post updated successfully");
      setShowUpdateModal(false);
      setUpdatePost({ name: "" });
      setPostToUpdate(null);
    } catch (error) {
      toast.error("Error updating post.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${postToDelete}`);
      setPosts(posts.filter((post) => post.id !== postToDelete));
      toast.success("Post deleted successfully");
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      toast.error("Error deleting post.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex ml-0 md:ml-[16.67%] items-center justify-between pt-[6rem]">
        <h4 className="text-[#4E4A4A] font-bold ml-7 ">Posts</h4>
        <button
          onClick={() => setShowModal(true)}
          className="text-[#fff] font-bold flex items-center justify-center mr-7 bg-blue-400 h-[30px] w-[30px] rounded"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="ml-0 md:ml-[16.67%]">
        <div className="ml-7 mr-7 overflow-x-auto">
          <table className="bg-slate-200 mt-5 w-full">
            <thead>
              <tr>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  ID
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Name
                </th>
                <th className="px-6 text-center py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-[#4E4A4A] uppercase tracking-wider min-w-[200px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center text-xl my-5">
                    Loading ...
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="bg-gray-50">
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {post.id}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      {post.name}
                    </td>
                    <td className="p-[2rem] text-center text-[#4E4A4A] font-semibold min-w-[200px]">
                      <button
                        onClick={() => {
                          setPostToUpdate(post);
                          setUpdatePost({ name: post.name });
                          setShowUpdateModal(true);
                        }}
                        className="mr-2 text-yellow-400"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => {
                          setPostToDelete(post.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Create Post</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full border p-2"
                value={newPost.name}
                onChange={(e) =>
                  setNewPost({ ...newPost, name: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Update Post</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full border p-2"
                value={updatePost.name}
                onChange={(e) =>
                  setUpdatePost({ ...updatePost, name: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostTable;
