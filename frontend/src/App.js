import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Products from './pages/Products';
import AddProducts from './pages/AddProduct';
import ProductPlan from './pages/ProductPlan';
import Login from './pages/Login';
import Users from './pages/Users'; 
import AddUser from './pages/AddUser';
import ConstantSystem from './pages/ConstantSystem';
import GetConstantSystem from './pages/GetConstantSystem';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/users/:id" element={<AddUser />} />
        <Route path="/constantSystem" element={<GetConstantSystem />} />
        <Route path="/addconstantSystem" element={<ConstantSystem />} />
        <Route path="/update-constant/:id" element={<ConstantSystem />} />
        <Route path="/products" element={<Products />} />
        <Route path="/addproducts" element={<AddProducts />} />
        <Route path="/products/:id" element={<AddProducts />} />
        <Route path="/planning" element={<ProductPlan />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
