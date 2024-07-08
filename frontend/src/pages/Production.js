// import React components and Routes
import React, { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import custom components
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import ProductionChain from '../components/products/ProductionChain'

const Production = () => {
  // work with states and redirect to dashboard
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
      {/* production chain */}
      <ProductionChain />
    </div>
  )
}

export default Production