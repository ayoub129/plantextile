import React, { useState , useEffect } from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { useNavigate } from 'react-router-dom'
import PostForm from '../components/ui/PostForm'
import PostList from '../components/ui/PostList'

const Posts = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, []);

  const [selectedPostId, setSelectedPostId] = useState(null);

  const handlePostSaved = () => {
    setSelectedPostId(null);
  };


  return (
    <div>
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      <Sidebar sidebar={sidebar} />
      <PostForm postId={selectedPostId} onPostSaved={handlePostSaved} />
      <PostList onSelectPost={setSelectedPostId} />
    </div>
  )
}

export default Posts