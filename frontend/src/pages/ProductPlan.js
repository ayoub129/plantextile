// import the react components and navigation
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import custom components
import ProductPlaning from '../components/products/ProductPlanning'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'

const ProductPlan = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // redirect to home if not logged in
    if (!token) {
      navigate('/');
    } else {
      // Check for the role
      const allowedRoles = ['admin', 'superadmin', 'developer' , 'Method'];
      if (!allowedRoles.includes(role)) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* product plan */}
      <ProductPlaning />
    </div>
  )
}

export default ProductPlan
