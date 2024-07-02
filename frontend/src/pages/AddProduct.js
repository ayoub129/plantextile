import React, { useEffect, useState } from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import AddProductForm from '../components/products/AddProductForm'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
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
      <AddProductForm />
    </div>
  )
}

export default AddProduct
