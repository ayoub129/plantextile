// import React components and Routers
import React, { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import custom components
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import EffectiveDirect from '../components/ui/EffectiveDirect'

const StandardEffectiveDirect = () => {
  // state and redirect the unauthorized users to the dashboard
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/dashboard'); 
    }
  }, []);

  return (
    <div>
      {/* header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* effective direct */}
      <EffectiveDirect />
    </div>
  )
}

export default StandardEffectiveDirect