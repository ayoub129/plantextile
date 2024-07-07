// import React componenets and the Routes
import React, { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Import Custom components
import ProductTables from '../components/products/ProductTable'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'

const Products = () => {
  // create the sidebar state and redirect if not authorized
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
      {/* Product data Table */}
      <ProductTables />
    </div>
  )
}

export default Products