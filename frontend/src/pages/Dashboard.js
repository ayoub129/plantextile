import React, { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import CardsData from "../components/ui/CardsData";
import LineChart from "../components/ui/LineChart";
import BarChart from "../components/ui/BarChart";
import DataTable from "../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

  console.log(
    mass16Indirect,
    mass17Indirect,
    mass175Indirect,
    mass16Direct,
    mass17Direct,
    mass175Direct
  );

  const [sidebar, setSidebar] = useState(false);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{ data: [] }, { data: [] }],
  });
  const [lineChartDataEffective, setLineChartDataEffective] = useState({
    labels: [],
    datasets: [{ data: [] }, { data: [] }],
  });
  const navigate = useNavigate();

  const calculateTotalWorkers = (data) => {
    return data.reduce((sum, item) => {
      const filteredValues = Object.entries(item)
        .filter(
          ([key]) =>
            ![
              "id",
              "created_at",
              "updated_at",
              "effective_real_id",
              "effective_standard_id",
            ].includes(key)
        )
        .map(([key, value]) => value || 0);
      return sum + filteredValues.reduce((s, val) => s + val, 0);
    }, 0);
  };

  const handleModal = async (model) => {
    setModel(model);
    try {
      const response = await api.get(`/product_plans_model_dash/${model.id}`);
      const data = response.data;

      const dates = Object.keys(data.planning);
      const planningData = Object.values(data.planning);
      console.log(data);
      const productionData = planningData.map((qte) => qte * 0.8); // Placeholder for actual production data

      // Set line chart data
      setLineChartData({
        labels: dates,
        datasets: [
          {
            label: "Planning",
            data: planningData,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
          {
            label: "Production Réelle",
            data: productionData,
            borderColor: "rgba(153,102,255,1)",
            backgroundColor: "rgba(153,102,255,0.2)",
          },
        ],
      });

      // Fetch effective data
      const effectiveResponse = await api.get(
        `/effective_data/${model.id}?start_date=${data.start_date}&end_date=${data.end_date}`
      );
      const effectiveData = effectiveResponse.data;

      // Process effective data
      const totalWorkersData = dates.map((date) => {
        const dayDataArray = effectiveData.filter((d) =>
          d.created_at.startsWith(date)
        );
        if (!dayDataArray.length) {
          return 0;
        }
        let totalWorkers = 0;
        dayDataArray.forEach((dayData) => {
          const { effectif_directs, effectif_indirects } = dayData;
          totalWorkers += calculateTotalWorkers(effectif_directs || []);
          totalWorkers += calculateTotalWorkers(effectif_indirects || []);
        });
        return totalWorkers;
      });

      // Fetch real effective data
      const effectiveRealResponse = await api.get(
        `/effective_real_data/${model.id}?start_date=${data.start_date}&end_date=${data.end_date}`
      );
      const effectiveRealData = effectiveRealResponse.data;
      console.log(effectiveRealData);

      // Process real effective data
      const totalRealWorkersData = dates.map((date) => {
        const dayDataArray = effectiveRealData.filter((d) =>
          d.created_at.startsWith(date)
        );
        if (!dayDataArray.length) {
          return 0;
        }
        let totalRealWorkers = 0;
        dayDataArray.forEach((dayData) => {
          const { effectif_directs, effectif_indirects } = dayData;
          totalRealWorkers += calculateTotalWorkers(effectif_directs || []);
          totalRealWorkers += calculateTotalWorkers(effectif_indirects || []);
        });
        return totalRealWorkers;
      });

      setLineChartDataEffective({
        labels: dates,
        datasets: [
          {
            label: "Effective Standard",
            data: totalWorkersData,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
          {
            label: "Effective Real",
            data: totalRealWorkersData,
            borderColor: "rgba(153,102,255,1)",
            backgroundColor: "rgba(153,102,255,0.2)",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

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

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Production",
        },
      },
    },
  };

  const newBarChartData = {
    labels: ["Coupe", "Chain 7", "Repassage", "Contrôle Final", "Export"],
    datasets: [
      {
        label: "Entrée",
        data: [0, 20, 90, 80, 50], // Replace with actual data
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Encours",
        data: [480, 20, 90, 80, 50], // Replace with actual data
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
      {
        label: "Production",
        data: [0, 0, 100, 800, 80], // Replace with actual data
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

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
      <CardsData handleModal={handleModal} models={models} />
      <div className="bg-slate-200 ml-0 md:ml-[16.67%] items-center pt-[3rem]">
        <h2 className="ml-7 mb-9 text-2xl font-semibold">
          Planning - Production
        </h2>
        <div className="w-full mr-5">
          {lineChartData && lineChartData.labels.length > 0 && (
            <LineChart data={lineChartData} options={lineChartOptions} />
          )}
        </div>
        <div className="w-full mr-5 mt-5">
          {lineChartData && lineChartData.labels.length > 0 && (
            <DataTable data={lineChartData} />
          )}
        </div>
        <h2 className="ml-7 my-9 text-2xl font-semibold">
          Effective Standard - Real
        </h2>
        <div className="w-full mr-5">
          {lineChartDataEffective &&
            lineChartDataEffective.labels.length > 0 && (
              <LineChart
                data={lineChartDataEffective}
                options={lineChartOptions}
              />
            )}
        </div>
        <div className="w-full mr-5 mt-5">
          {lineChartDataEffective &&
            lineChartDataEffective.labels.length > 0 && (
              <DataTable data={lineChartDataEffective} />
            )}
        </div>
        <h2 className="ml-7 my-9 text-2xl font-semibold">Les stages</h2>
        <div className="w-full mr-5">
          <BarChart data={newBarChartData} options={barChartOptions} />
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
