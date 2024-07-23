import React, { useEffect, useState } from "react";
import BarChart from "../ui/BarChart";
import api from "../../api/axios";

const ChainChart = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [error, setError] = useState(null);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
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
          text: "Chain",
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

    const fetchChains = async () => {
      try {
        const response = await api.get("/chains");
        setChains(response.data);
      } catch (error) {
        console.error("Error fetching chains:", error);
      }
    };

    fetchModels();
    fetchChains();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedChain(""); // Reset chain selection when model changes
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const fetchData = async () => {
    setError(null);
    try {
      let response;
      if (selectedChain) {
        response = await api.get(`/chain_production_data/${selectedModel}?chain=${selectedChain}`);
      } else {
        response = await api.get(`/chain_production_data/${selectedModel}`);
      }
  
      console.log(response);
  
      const data = response.data;
  
      const labels = [];
      const entreData = [];
      const sortieData = [];
      const encoursData = [];
  
      // Process each chain's data
      Object.keys(data).forEach((chainId) => {
        const item = data[chainId];
        const chain = chains.find((chain) => chain.id === parseInt(chainId));
        const chainName = chain ? chain.name : chainId;
        labels.push(chainName);
        entreData.push(item.totalEntre);
        sortieData.push(item.latestSortie);
        encoursData.push(item.totalEntre - item.latestSortie);
      });
  
      // Add totals
      labels.push("Total");
      entreData.push(entreData.reduce((a, b) => a + b, 0));
      sortieData.push(sortieData.reduce((a, b) => a + b, 0));
      encoursData.push(encoursData.reduce((a, b) => a + b, 0));
  
      setBarChartData({
        labels,
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
      console.log(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  
  useEffect(() => {
    if (selectedModel) {
      fetchData();
    }
  }, [selectedModel, selectedChain]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="ml-7 mb-9 text-2xl font-semibold">
          Chain Production Chart
        </h2>
        <div className="mr-7 flex items-center">
          <div className="mr-4">
            <label className="block font-semibold mb-2">Select a Model :</label>
            <select
              className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
              value={selectedModel}
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
          <div>
            <label className="block font-semibold mb-2">Select a Chain :</label>
            <select
              className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
              value={selectedChain}
              onChange={handleChainChange}
              disabled={!selectedModel}
            >
              <option value="">All Chains</option>
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
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

export default ChainChart;
