import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import DataTable from "../ui/DataTable";
import LineChart from "../ui/LineChart";

const PlanningChart = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [models, setModels] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{ data: [] }, { data: [] }],
  });
  const [error, setError] = useState(null);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleModal = async (model) => {
    setError(null);
    try {
      const ProductionData = await api.get(`/export_total/${model.id}`);
      const data = ProductionData.data;
      const productionData = Object.values(data.daily_export_values);

      const PlanningData = await api.get(
        `/product_plans_model_dash/${model.id}`
      );
      const dates = Object.keys(PlanningData.data.planning).map(formatDate);
      const planingData = Object.values(PlanningData.data.planning);

      // Set line chart data
      setLineChartData({
        labels: dates,
        datasets: [
          {
            label: "Planning",
            data: planingData,
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
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="ml-7 mb-9 text-2xl font-semibold">
          Planning - Production
        </h2>

        <div className="mr-7 ">
          <label className="block font-semibold	mb-2">Select a Model :</label>
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Select model</option>
            {models &&
              models.map((m) => (
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
          <LineChart data={lineChartData} options={lineChartOptions} />
        )}
      </div>
      <div className="w-full mr-5 mt-5">
        <DataTable type={"positive"} data={lineChartData} />
      </div>
    </div>
  );
};

export default PlanningChart;
