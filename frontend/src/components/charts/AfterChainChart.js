import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import BarChart from "../ui/BarChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AfterChainChart = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [barChartData, setBarChartData] = useState({
    labels: [
      "Repassage",
      "Control Final",
      "Magasin Furniture",
      "Magasin Final",
      "Export",
    ],
    datasets: [
      {
        label: "Entrée",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(54,162,235,0.8)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
      {
        label: "Encours",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(255,99,132,0.8)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Sortie",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(75,192,192,0.8)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

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
    setError(null);
    try {
      const [
        sortie,
        repassageResponse,
        controlResponse,
        magasinFResponse,
        magasinResponse,
        exportResponse,
      ] = await Promise.all([
        api.get(`/production_chains/${modelId}/sortie`),
        api.get(`/repassage_production/${modelId}`),
        api.get(`/control_production/${modelId}`),
        api.get(`/magasin_fourniture_production/${modelId}`),
        api.get(`/magasin_production/${modelId}`),
        api.get(`/export/${modelId}`),
      ]);

      const repassageData = repassageResponse.data;
      const controlData = controlResponse.data;
      const magasinFData = magasinFResponse.data;
      const magasinData = magasinResponse.data;
      const exportData = exportResponse.data;

      const entreData = [
        sortie.data.totalSortie || 0,
        repassageResponse.data.value || 0,
        controlData.value || 0,
        magasinFData.value || 0,
        magasinData.value || 0,
      ];

      const sortieData = [
        repassageData.value || 0,
        controlData.value || 0,
        magasinFData.value || 0,
        magasinData.value || 0,
        exportData.value || 0,
      ];

      const encoursData = entreData.map(
        (entre, index) => entre - sortieData[index]
      );

      setBarChartData({
        labels: [
          "Repassage",
          "Control Final",
          "Magasin Furniture",
          "Magasin Final",
          "Export",
        ],
        datasets: [
          {
            label: "Entrée",
            data: entreData,
            backgroundColor: "rgba(54,162,235,0.8)",
            borderColor: "rgba(54,162,235,1)",
            borderWidth: 1,
          },
          {
            label: "Encours",
            data: encoursData,
            backgroundColor: "rgba(255,99,132,0.8)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
          },
          {
            label: "Sortie",
            data: sortieData,
            backgroundColor: "rgba(75,192,192,0.8)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="ml-7">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">After Chain Production Chart</h2>
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
  );
};

export default AfterChainChart;
