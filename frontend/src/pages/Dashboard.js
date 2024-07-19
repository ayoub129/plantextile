import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CoupeChart from "../components/charts/CoupeChart";
import PlanningChart from "../components/charts/PlanningChart";
import EffectiveChart from "../components/charts/EffectiveChart";
import ChainChart from "../components/charts/ChainChart";
import AfterChainChart from "../components/charts/AfterChainChart";
import MargeNette from "../components/charts/MargeNette";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import CardsData from "../components/ui/CardsData";
import BarChart from "../components/ui/BarChart";

const Dashboard = () => {
  const [couteDeRevient, setCouteDeRevient] = useState(0);
  const [realFils, setRealFils] = useState(0);
  const [realPlastique, setRealPlastique] = useState(0);
  const [estimationFils, setEstimationFils] = useState(0);
  const [estimationPlastique, setEstimationPlastique] = useState(0);
  const [transport, setTransport] = useState(0);
  const [massSalaryTotal, setMassSalaryTotal] = useState(0);

  const [congeDirect, setCongeDirect] = useState(0);
  const [congeInDirect, setCongeInDirect] = useState(0);
  const [massSalaryDirect, setMassSalaryDirect] = useState(0);
  const [massSalaryInDirect, setMassSalaryInDirect] = useState(0);

  const [mass16Indirect, setMass16Indirect] = useState(0);
  const [mass17Indirect, setMass17Indirect] = useState(0);
  const [mass175Indirect, setMass175Indirect] = useState(0);
  const [mass16Direct, setMass16Direct] = useState(0);
  const [mass17Direct, setMass17Direct] = useState(0);
  const [mass175Direct, setMass175Direct] = useState(0);

  const [mass16percentage, setMass16percentage] = useState(0);
  const [mass17percentage, setMass17percentage] = useState(0);
  const [mass175percentage, setMass175percentage] = useState(0);
  const [mass16hour, setMass16hour] = useState(0);
  const [mass17hour, setMass17hour] = useState(0);
  const [mass175hour, setMass175hour] = useState(0);

  const [totalPieces, setTotalPieces] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [effectifDirect, setEffectifDirect] = useState(0);
  const [effectifInDirect, setEffectifInDirect] = useState(0);

  const [transIndirect, setTransIndirect] = useState();
  const [transDirect, setTransDirect] = useState();
  const [totalHour, setTotalHour] = useState(null);
  const [totalHourIndirect, setTotalHourIndirect] = useState(null);
  const [models, setModels] = useState([]);
  const [model, setModel] = useState(null);

  const under = model && model.qte_societe * parseInt(model.prixMOver);

  const CalculateEstimation = (type) => {
    if (type == "plastique") {
      const estimationPlastique = (+totalPieces * (15000 / 18600)).toFixed(2);
      setEstimationPlastique(estimationPlastique);
    } else {
      const estimationFils = (+totalPieces * (20000 / 18600)).toFixed(2);
      setEstimationFils(estimationFils);
    }
  };

  const CalculatebTotalHours = (type) => {
    if (type == "indirect") {
      const qp = effectifInDirect / totalChains;
      setTotalHourIndirect(qp * 9);
      setTransIndirect((totalHourIndirect * (80 / 208)).toFixed(2));
    } else {
      setTotalHour(9 * effectifDirect);
      setTransDirect(((totalHour * 80) / 208).toFixed(2));
    }
  };

  const CalculateConge = (type) => {
    if (type == "indirect") {
      setCongeInDirect(((totalHourIndirect * 1.5 * 8) / (26 * 8)).toFixed(2));
    } else {
      setCongeDirect(((totalHour * 1.5 * 8) / (26 * 8)).toFixed(2));
    }
  };

  const CalculateSalaries = (type) => {
    if (type == "direct") {
      setMass16Direct((mass16hour * mass16percentage * totalHour).toFixed(2));
      setMass17Direct((mass17hour * mass17percentage * totalHour).toFixed(2));
      setMass175Direct(
        (mass175hour * mass175percentage * totalHour).toFixed(2)
      );
      setMassSalaryDirect(
        mass16Direct + mass17Direct + mass175Direct + congeDirect
      );
    } else {
      setMass16Indirect(
        (mass16hour * mass16percentage * totalHourIndirect).toFixed(2)
      );
      setMass17Indirect(
        (mass17hour * mass17percentage * totalHourIndirect).toFixed(2)
      );
      setMass175Indirect(
        (mass175hour * mass175percentage * totalHourIndirect).toFixed(2)
      );
      setMassSalaryInDirect(
        mass16Indirect + mass17Indirect + mass175Indirect + congeInDirect
      );
    }
  };

  useEffect(() => {
    const fetchTotalPiecesInDepot = async () => {
      try {
        const response = await api.get("/export_total");
        setTotalPieces(response.data.total_value);
        CalculateEstimation("plastique");
        CalculateEstimation("fils");
      } catch (error) {
        console.log("Error Happened");
      }
    };

    const fetchTotalChains = async () => {
      try {
        const resposnse = await api.get("/total_chain");
        setTotalChains(resposnse.data.total_chains);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSalaries = async () => {
      try {
        const response = await api.get("/salaries");
        setMass16percentage(response.data.Masse_salariale_16_29);
        setMass17percentage(response.data.Masse_salariale_17_00);
        setMass175percentage(response.data.Masse_salariale_17_50);
        setMass16hour(response.data.Taux_horaire_SMIG_16_29);
        setMass17hour(response.data.Taux_horaire_17_00);
        setMass175hour(response.data.Taux_horaire_17_50);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSalaries();
    fetchTotalChains();
    fetchTotalPiecesInDepot();
  }, []);

  useEffect(() => {
    const fetchTotalworkers = async () => {
      try {
        const response = await api.get(`/effective_indirect`);
        const responseDirect = await api.get(
          `/effective_direct_real/${model.id}`
        );

        setEffectifInDirect(parseInt(response.data.total_effectif_indirect));
        setEffectifDirect(parseInt(responseDirect.data.total_effectif_direct));
        CalculatebTotalHours("indirect");
        CalculatebTotalHours("direct");
        setTransport(transDirect + transIndirect);
        CalculateConge("indirect");
        CalculateConge("direct");
        CalculateSalaries("direct");
        CalculateSalaries("indirect");
        setMassSalaryTotal(massSalaryDirect + massSalaryInDirect);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalworkers();
  }, [model]);

  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const BarChartData = {
    labels: ["Category 1", "Category 2", "Category 3"],
    datasets: [
      {
        data: [60, 50, 30], // Replace with actual data
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(75,192,192,0.2)",
          "rgba(0,192,192,0.2)", // Latest bar with different color
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(75,192,192,1)",
          "rgba(0,192,192,1)", // Latest bar with different color
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
        },
      },
    },
  };

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
        <div className="my-10">
          <MargeNette />
        </div>
        <h2 className="ml-7 my-9 text-2xl font-semibold">La Marge nette</h2>
        <div className="w-full mr-5">
          <BarChart data={BarChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
