import React, { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { useNavigate } from "react-router-dom";
import Control from "../components/products/Control";

const ControlFinal = () => {
  // handle state change for the sidebar and redirect if not autorized
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
      const allowedRoles = [
        "admin",
        "superadmin",
        "developer",
        "Contrôle_final",
      ];
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
      {/* control final */}
      <Control />
    </div>
  );
};

export default ControlFinal;
