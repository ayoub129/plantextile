import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RepassageProduction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [value, setValue] = useState(0);
  const [totalSortie, setTotalSortie] = useState(0);
  const [encore, setEncore] = useState(0);

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
    const fetchRepassageProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(
            `/repassage_production/${selectedModel}`
          );
          calculateEncore(selectedModel, response.data.value);
          setValue(response.data.value);
        } catch (error) {
          calculateEncore(selectedModel, 0);
          console.error("Error fetching RepassageProduction data:", error);
        }
      }
    };

    fetchRepassageProduction();
  }, [selectedModel]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChange = async (direction) => {
    let newValue = value;
    if (direction === "next") {
      newValue = value + 1;
    } else if (direction === "prev") {
      newValue = value - 1;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > totalSortie) {
      toast.error("Total Repassage can't be more than the total sortie");
      return;
    }

    setValue(newValue);

    try {
      await api.post(`/repassage_production/${selectedModel}`, {
        value: newValue,
      });
      calculateEncore(selectedModel, newValue);
    } catch (error) {
      console.error("Error updating RepassageProduction data:", error);
    }
  };

  const calculateEncore = async (modelId, repassageValue) => {
    try {
      const response = await api.get(`/production_chains/${modelId}/entre`);
      const totalEntre = response.data.totalEntre;
      setTotalSortie(totalEntre);

      const encore = totalEntre - repassageValue;
      if (encore < 0) {
        toast.error("Encore cannot be less than 0");
        setEncore(0);
      } else {
        setEncore(encore);
      }
    } catch (error) {
      console.error("Error calculating encore:", error);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Repassage</h2>
        <div className="ml-7 mb-4 pr-6">
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleModelChange}
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
      {selectedModelData && (
        <div className="w-full pr-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl">
              {selectedModelData.category}
            </h3>
            <h3 className="font-semibold text-xl">
              {selectedModelData.client}
            </h3>
          </div>
          <h3 className="font-semibold text-xl">encore: {encore}</h3>
        </div>
      )}
      {selectedModel && (
        <div className="flex p-5 mt-[2rem] mb-4 shadow-md w-fit p-1 rounded border">
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
            onClick={() => handleChange("prev")}
          >
            -
          </button>
          <div className="flex flex-col items-center">
            <label className="font-semibold text-[18px]">Total Repassage</label>
            <input
              type="number"
              className="block w-full mt-1 outline-0 p-[.5rem] border border-[#b3b3b3] rounded text-center"
              value={value}
              readOnly
            />
          </div>
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
            onClick={() => handleChange("next")}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default RepassageProduction;
