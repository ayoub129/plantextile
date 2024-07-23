// import React components and Routers
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import custom components
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import EffectiveIndirect from "../components/ui/EffectiveInDirect";

const RealEffectiveInDirect = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // redirect to home if not logged in
    if (!token) {
      navigate("/");
    } else {
      // Check for the role
      const allowedRoles = ["admin", "superadmin", "developer", "RH"];
      if (!allowedRoles.includes(role)) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* header */}
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      {/* sidebar */}
      <Sidebar sidebar={sidebar} />
      {/* effective direct */}
      <EffectiveIndirect
        getIndirect="effective_indirect_real"
        url="effective_real"
      />
    </div>
  );
};

export default RealEffectiveInDirect;
