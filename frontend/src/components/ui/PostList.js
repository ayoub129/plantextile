import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';

const PostList = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Error fetching posts.');
      }
    };

    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post.');
    }
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
      <ToastContainer />
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50">Logistique</th>
            <th className="px-6 py-3 bg-gray-50">La Coupe</th>
            <th className="px-6 py-3 bg-gray-50">Production</th>
            <th className="px-6 py-3 bg-gray-50">Repassage</th>
            <th className="px-6 py-3 bg-gray-50">Control Final</th>
            <th className="px-6 py-3 bg-gray-50">Depot</th>
            <th className="px-6 py-3 bg-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4">{post.logistique}</td>
              <td className="px-6 py-4">{post.la_coupe}</td>
              <td className="px-6 py-4">{post.production}</td>
              <td className="px-6 py-4">{post.repassage}</td>
              <td className="px-6 py-4">{post.control_final}</td>
              <td className="px-6 py-4">{post.depot}</td>
              <td className="px-6 py-4">
                <button onClick={() => onSelectPost(post.id)} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
                <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900 ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostList;
