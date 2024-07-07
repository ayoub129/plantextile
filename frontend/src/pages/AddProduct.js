// import React component and Router
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import custom components
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import AddProductForm from '../components/products/AddProductForm'

const AddProduct = () => {
  // handle sidebar state change and navigation
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
      const allowedRoles = ['admin', 'superadmin', 'developer' , 'Logistique'];
      if (!allowedRoles.includes(role)) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* Header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* Create a product */}
      <AddProductForm />
    </div>
  )
}

export default AddProduct
