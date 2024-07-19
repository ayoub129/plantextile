import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import DataTable from "../ui/DataTable";
import LineChart from "../ui/LineChart";

const EffectiveChart = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [models, setModels] = useState([]);
  const [lineChartDataEffective, setLineChartDataEffective] = useState({
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
          text: "Workers",
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
      // Fetch effective data
      const effectiveResponse = await api.get(
        `/effective_data_total/${model.id}`
      );
      const effectiveData = effectiveResponse.data;
      const dates = Object.keys(effectiveData).map(formatDate);

      const standardDirectData = Object.values(effectiveData).map(
        (data) => data.effectifDirects
      );
      const standardIndirectData = Object.values(effectiveData).map(
        (data) => data.effectifIndirects
      );
      const standardTotalData = Object.values(effectiveData).map(
        (data) => data.total
      );

      // Fetch real effective data
      const effectiveRealResponse = await api.get(
        `/effective_real_total/${model.id}`
      );
      const effectiveRealData = effectiveRealResponse.data;

      const realDirectData = Object.values(effectiveRealData).map(
        (data) => data.effectifDirects
      );
      const realIndirectData = Object.values(effectiveRealData).map(
        (data) => data.effectifIndirects
      );
      const realTotalData = Object.values(effectiveRealData).map(
        (data) => data.total
      );

      // Set line chart data
      setLineChartDataEffective({
        labels: dates,
        datasets: [
          {
            label: "Standard Direct",
            data: standardDirectData,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
          {
            label: "Standard Indirect",
            data: standardIndirectData,
            borderColor: "rgba(75,75,192,1)",
            backgroundColor: "rgba(75,75,192,0.2)",
          },
          {
            label: "Real Direct",
            data: realDirectData,
            borderColor: "rgba(153,102,255,1)",
            backgroundColor: "rgba(153,102,255,0.2)",
          },
          {
            label: "Real Indirect",
            data: realIndirectData,
            borderColor: "rgba(153,102,75,1)",
            backgroundColor: "rgba(153,102,75,0.2)",
          },
          {
            label: "Standard Total",
            data: standardTotalData,
            borderColor: "rgba(255,165,0,1)",
            backgroundColor: "rgba(255,165,0,0.2)",
          },
          {
            label: "Real Total",
            data: realTotalData,
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.2)",
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
          Effective Standard - Real
        </h2>
        <div className="mr-7 ">
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
      </div>
      <div className="w-full mr-5">
        {error ? (
          <div className="text-red-500 ml-7">{error}</div>
        ) : (
          <LineChart data={lineChartDataEffective} options={lineChartOptions} />
        )}
      </div>
      <div className="w-full mr-5 mt-5">
        <DataTable type={"negative"} data={lineChartDataEffective} />
      </div>
    </div>
  );
};

export default EffectiveChart;
