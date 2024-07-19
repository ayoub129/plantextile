import React, { useEffect, useState } from "react";
import BarChart from "../ui/BarChart";
import api from "../../api/axios";

const CoupeChart = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [barChartData, setBarChartData] = useState({
    labels: ["Coupe"],
    datasets: [
      {
        label: "Entrée",
        data: [0],
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Encours",
        data: [0],
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
      {
        label: "Sortie",
        data: [0],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedModelData = models.find(
      (model) => model.id === parseInt(event.target.value)
    );

    handleModal(selectedModelData);
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

  const handleModal = async (model) => {
    setError(null);
    try {
      const response = await api.get(`/coupe_production/${model.id}`);
      const coupeProductionValue = response.data.value;
      const entreValue = model.qte_societe;
      const encoursValue = entreValue - coupeProductionValue;
      setBarChartData({
        labels: ["Coupe"],
        datasets: [
          {
            label: "Entrée",
            data: [entreValue],
            backgroundColor: "rgba(54,162,235,0.8)",
            borderColor: "rgba(54,162,235,1)",
            borderWidth: 1,
          },
          {
            label: "Encours",
            data: [encoursValue],
            backgroundColor: "rgba(255,99,132,0.8)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
          },
          {
            label: "Sortie",
            data: [coupeProductionValue],
            backgroundColor: "rgba(75,192,192,0.8)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="ml-7 mb-9 text-2xl font-semibold">Coupe Chart</h2>
        <div className="mr-7 ">
          <label className="block font-semibold mb-2">Select a Model :</label>
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Select model</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.modele}
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

export default CoupeChart;
