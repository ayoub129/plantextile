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
  const [selectedDate, setSelectedDate] = useState("");

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
        beginAtZero: true,
      },
    },
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedModelData = models.find(
      (model) => model.id === parseInt(event.target.value)
    );
    if (selectedModelData) {
      fetchPlanningData(selectedModelData.id, selectedDate);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    const selectedModelData = models.find(
      (model) => model.id === parseInt(selectedOption)
    );
    if (selectedModelData) {
      fetchPlanningData(selectedModelData.id, event.target.value);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to fetch models. Please try again.");
      }
    };

    fetchModels();
  }, []);

  const fetchPlanningData = async (model, date = "") => {
    setError(null);
    try {
        const endpoint = date
          ? `/product_plans_model_dash/${model}/${date}`
          : `/product_plans_model_dash/${model}`;

        const planningResponse = await api.get(endpoint);

        const prodEndpoint = date 
          ? `/export_total/${model}/${date}`
          : `/export_total/${model}`;

        const productionResponse = await api.get(prodEndpoint);
        console.log(productionResponse)
 
        const productionData = Object.values(productionResponse.data.planning);
        const planningData = planningResponse.data.planning;

        let labels = [];
        let planingData = [];

        if (date) {
          // Data for a specific date (hourly data)
          labels = planningData[date].map(item => item.hour);
          planingData = planningData[date].map(item => item.models_finished);
        } else {
          // Data for a range of dates (daily sums)
          labels = Object.keys(planningData);
          planingData = Object.values(planningData);
        }

        setLineChartData({
          labels,
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
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="pt-[5.5rem]">
      <div className="flex items-center justify-between">
        <h2 className="ml-7 mb-9 text-2xl font-semibold">
          Planning - Production
        </h2>

        <div className="flex items-center">
          <div className="mr-7">
            <label className="block font-semibold mb-2">Select a Model :</label>
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

          <div className="mr-7">
            <label className="block font-semibold mb-2">Select a Date :</label>
            <input
              type="date"
              className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
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
