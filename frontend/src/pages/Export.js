import React, { useState , useEffect } from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { useNavigate } from 'react-router-dom'
import ExportProduction from '../components/products/ExportProduction'

const Export = () => {
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
      <ExportProduction />
    </div>
  )
}

export default Export