import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoupeChart from "../components/charts/CoupeChart";
import PlanningChart from "../components/charts/PlanningChart";
import EffectiveChart from "../components/charts/EffectiveChart";
import ChainChart from "../components/charts/ChainChart";
import AfterChainChart from "../components/charts/AfterChainChart";
import MargeNette from "../components/charts/MargeNette";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import CardsData from "../components/ui/CardsData";

const Dashboard = () => {
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
      const allowedRoles = ["admin", "superadmin", "developer"];
      if (!allowedRoles.includes(role)) {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div>
      <Header sidebar={sidebar} setSidebar={setSidebar} />
      <Sidebar sidebar={sidebar} />
      <CardsData />
      <div className="bg-slate-200 ml-0 md:ml-[16.67%] items-center pt-[3rem]">
        <PlanningChart />
        <div className="my-10">
          <EffectiveChart />
        </div>
        <div className="my-10">
          <CoupeChart />
        </div>
        <div className="my-10">
          <ChainChart />
        </div>
        <div className="my-10">
          <AfterChainChart />
        </div>
        <div className="mt-10">
          <MargeNette />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
