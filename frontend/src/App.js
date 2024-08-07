import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProduct";
import ProductPlan from "./pages/ProductPlan";
import Login from "./pages/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import ConstantSystem from "./pages/ConstantSystem";
import StandardEffectiveDirect from "./pages/StandardEffectiveDirect";
import StandardEffectiveInDirect from "./pages/StandardEffectiveInDirect";
import Chains from "./pages/Chains";
import RealEffectiveInDirect from "./pages/RealEffectiveInDirect";
import RealEffectiveDirect from "./pages/RealEffectiveDirect";
import Coupe from "./pages/Coupe";
import Repassage from "./pages/Repassage";
import ControlFinal from "./pages/ControlFinal";
import ProductionEntre from "./pages/ProductionEntre";
import ProductionSortie from "./pages/ProductionSortie";
import Export from "./pages/Export";
import Magasin from "./pages/Magasin";
import Profile from "./pages/Profile";
import UpdatePassword from "./pages/UpdatePassword";
import Posts from "./pages/Posts";
import Primes from "./pages/Primes";
import MagasinFrourniture from "./pages/MagasinFrourniture";
import PlastiqueFile from "./pages/PlastiqueFile";
import AdminAccept from "./pages/AdminAccept";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/users/:id" element={<AddUser />} />
        <Route path="/chains" element={<Chains />} />
        <Route path="/products" element={<Products />} />
        <Route path="/addproducts" element={<AddProducts />} />
        <Route path="/products/:id" element={<AddProducts />} />
        <Route path="/real-direct" element={<RealEffectiveDirect />} />
        <Route path="/real-indirect" element={<RealEffectiveInDirect />} />
        <Route path="/direct" element={<StandardEffectiveDirect />} />
        <Route path="/indirect" element={<StandardEffectiveInDirect />} />
        <Route path="/planning" element={<ProductPlan />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/primes" element={<Primes />} />
        <Route path="/coupe" element={<Coupe />} />
        <Route path="/production_entre" element={<ProductionEntre />} />
        <Route path="/production_sortie" element={<ProductionSortie />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/repassage" element={<Repassage />} />
        <Route path="/control-final" element={<ControlFinal />} />
        <Route path="/magasin_fourniture" element={<MagasinFrourniture />} />
        <Route path="/plastique_file" element={<PlastiqueFile />} />
        <Route path="/magasin" element={<Magasin />} />
        <Route path="/export" element={<Export />} />
        <Route path="/admin" element={<AdminAccept />} />
        <Route path="/addconstantSystem" element={<ConstantSystem />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
