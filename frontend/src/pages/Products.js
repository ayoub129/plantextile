import React from 'react'
import ProductTables from '../components/products/ProductTable'
import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'

const Products = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <ProductTables />
    </div>
  )
}

export default Products
