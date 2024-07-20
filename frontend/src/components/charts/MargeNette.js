import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import BarChart from "../ui/BarChart";

const MargeNette = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [systemConstant, setSystemConstant] = useState({
    Nombre_d_heures_par_jour: "",
    Taux_horaire_SMIG_16_29: "",
    Taux_horaire_17_00: "",
    Taux_horaire_17_50: "",
    Masse_salariale_16_29: "",
    Masse_salariale_17_00: "",
    Masse_salariale_17_50: "",
    Capacité_par_unité_transport: "",
    cotisation_entroprise_trans: "",
    Coût_par_trajet: "",
    Coût_énergie_journalier: "",
    Coût_charges_fixes_journalier: "",
  });
  const [chargeDirect, setChargeDirect] = useState(null);

  const [barChartData , setBarChartData] =useState({
    labels: ["Production dépôt en valeur", "Coût de revient", "La marge nette"],
    datasets: [
      {
        data: [0, 0, 0], 
        backgroundColor: [
          "rgba(75,192,192,0.2)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
        ],
        borderWidth: 1,
      },
    ],
  }) 

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
          text: "Stage",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };


  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
        const systemResponse = await api.get("/system_constants_latest");
        if (systemResponse.data) {
          const { id, created_at, updated_at, effectif_fix, ...filteredData } =
            systemResponse.data;

            setSystemConstant({
              ...filteredData,
            });
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedModel(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (modelId) => { 
    try {
      setError(null);

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  }
  return <div className="ml-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">La Marge Nette</h2>
        <div className="ml-7 mb-4 pr-6">
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleSelectChange}
          >
            <option value="">Select model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full mr-5">
        {error ? (
          <div className="text-red-500 ml-7">{error}</div>
        ) : (
          <BarChart data={barChartData} options={barChartOptions} />
        )}
      </div>
  </div>
};

export default MargeNette;
