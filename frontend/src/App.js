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
import StandardEffectiveDirect from './pages/StandardEffectiveDirect';
import StandardEffectiveInDirect from './pages/StandardEffectiveInDirect';
import Posts from './pages/Posts';
import Chains from './pages/Chains';
import AddChains from './pages/AddChains';
import RealEffectiveInDirect from './pages/RealEffectiveInDirect';
import RealEffectiveDirect from './pages/RealEffectiveDirect';
import Coupe from './pages/Coupe';
import Repassage from './pages/Repassage';
import ControlFinal from './pages/ControlFinal';
import Production from './pages/Production';
import Export from './pages/Export';
import Result from './pages/Result';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/addproducts" element={<AddProducts />} />
        <Route path="/products/:id" element={<AddProducts />} />
        <Route path="/planning" element={<ProductPlan />} />
        <Route path='/direct' element={<StandardEffectiveDirect />} />
        <Route path='/indirect' element={<StandardEffectiveInDirect />} />
        <Route path='/posts' element={<Posts />} />
        <Route path="/users" element={<Users />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/edituser/:id" element={<AddUser />} />
        <Route path="/chains" element={<Chains />} />
        <Route path="/addChains" element={<AddChains />} />
        <Route path="/editChain/:id" element={<AddChains />} />
        <Route path='/real-direct' element={<RealEffectiveDirect />} />
        <Route path='/real-indirect' element={<RealEffectiveInDirect />} />
        <Route path='/coupe' element={<Coupe />} />
        <Route path='/repassage' element={<Repassage />} />
        <Route path='/production' element={<Production />} />
        <Route path='/export' element={<Export />} />
        <Route path='/result' element={<Result />} />
        <Route path='/control-final' element={<ControlFinal />} />
        <Route path="/constantSystem" element={<GetConstantSystem />} />
        <Route path="/addconstantSystem" element={<ConstantSystem />} />
        <Route path="/update-constant/:id" element={<ConstantSystem />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
