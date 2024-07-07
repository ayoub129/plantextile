// import React component and Router
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import custom components
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import ProfileForm from '../components/users/ProfileForm'

const Profile = () => {
  // handle sidebar state change and navigation
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');

    // redirect to home if not logged in
    if (!token) {
      navigate('/');
    } 
  }, [navigate]);

  return (
    <div>
      {/* Header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* Profile form */}
      <ProfileForm />
    </div>
  )
}

export default Profile
