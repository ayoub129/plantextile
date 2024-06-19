import React from 'react'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import AddProductForm from '../components/products/AddProductForm'

const AddProduct = () => {
  return (
    <div>
        <Header />
        <Sidebar />
        <div className='mt-20'>
          <AddProductForm />
        </div>
    </div>
  )
}

export default AddProduct
