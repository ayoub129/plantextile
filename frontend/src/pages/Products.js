import React, { useState , useEffect } from 'react'
import ProductTables from '../components/products/ProductTable'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { useNavigate } from 'react-router-dom'

const Products = () => {
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
      <ProductTables />
    </div>
  )
}

export default Products
