import React, { useEffect, useState } from 'react'
import ProductPlaning from '../components/products/ProductPlanning'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { useNavigate } from 'react-router-dom'

const ProductPlan = () => {
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
      <ProductPlaning />
    </div>
  )
}

export default ProductPlan
