import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MagasinFournitureProduction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [production, setProduction] = useState(0);
  const [entre, setEntre] = useState(0);
  const [encore, setEncore] = useState(0);
  const [totalSortie, setTotalSortie] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
    const fetchMagasinFournitureProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(
            `/magasin_fourniture_production/${selectedModel}`
          );
          setProduction(response.data.value);
          setEntre(response.data.entre || 0);
          setEncore(response.data.encore || 0);
          calculateEncore(response.data.value);
        } catch (error) {
          calculateEncore(0);
          console.error(
            "Error fetching Magasin Fourniture Production data:",
            error
          );
        }
      }
    };

    fetchMagasinFournitureProduction();
  }, [selectedModel]);

  const calculateEncore = async (magasinValue) => {
    try {
      const response = await api.get(`/control_production/${selectedModel}`);
      const totalSortie = response.data.value;
      setTotalSortie(totalSortie);

      const encore = totalSortie - magasinValue;
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

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChange = async (direction, type) => {
    let newValue = type === "production" ? production : entre;
    if (direction === "next") {
      newValue += 1;
    } else if (direction === "prev") {
      newValue -= 1;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > totalSortie) {
      toast.error(
        "Total Magasin Fourniture can't be more than the total Control final"
      );
      return;
    }

    if (type === "production") {
      setProduction(newValue);
    } else if (type === "entre") {
      setEntre(newValue);
    }

    setIsButtonDisabled(true);

    try {
      await api.post(`/magasin_fourniture_production/${selectedModel}`, {
        value: type === "production" ? newValue : production,
      });
      calculateEncore(newValue);
    } catch (error) {
      console.error(
        "Error updating Magasin Fourniture Production data:",
        error
      );
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Magasin Fourniture</h2>
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
          <h3 className="font-semibold text-xl">Encore: {encore}</h3>
        </div>
      )}
      {selectedModel && (
        <div className="flex p-5 mt-[2rem] mb-4 shadow-md w-fit p-1 rounded border">
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
            onClick={() => handleChange("prev", "production")}
            disabled={isButtonDisabled}
          >
            -
          </button>
          <div className="flex flex-col items-center">
            <label className="font-semibold text-[18px]">
              Total Magasin Fourniture
            </label>
            <input
              type="number"
              className="block w-full mt-1 outline-0 p-[.5rem] border border-[#b3b3b3] rounded text-center"
              value={production}
              readOnly
            />
          </div>
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
            onClick={() => handleChange("next", "production")}
            disabled={isButtonDisabled}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default MagasinFournitureProduction;
