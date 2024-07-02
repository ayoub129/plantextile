import React, { useState , useEffect } from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { useNavigate } from 'react-router-dom'
import EffectiveDirect from '../components/ui/EffectiveDirect'

const StandardEffectiveDirect = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, []);

  return (
    <div>
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      <Sidebar sidebar={sidebar} />
      <EffectiveDirect />
    </div>
  )
}

export default StandardEffectiveDirect