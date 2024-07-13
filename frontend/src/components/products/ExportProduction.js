import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";

const ExportProduction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [production, setProduction] = useState(0);
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
    const fetchExportProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(`/export/${selectedModel}`);
          setProduction(response.data.value);
        } catch (error) {
          console.error("Error fetching ExportProduction data:", error);
        }
      }
    };

    fetchExportProduction();
  }, [selectedModel]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const onChange = (name, value) => {
    if (name === "production") {
      setProduction(parseInt(value, 10));
    }
  };

  const handleChange = async (direction, type) => {
    let newValue = type === "production" && production;
    if (direction === "next") {
      newValue += 1;
    } else if (direction === "prev" && newValue > 0) {
      newValue -= 1;
    }

    if (type === "production") {
      setProduction(newValue);
    }

    setIsButtonDisabled(true);

    try {
      await api.post(`/export/${selectedModel}`, {
        value: production,
      });
    } catch (error) {
      console.error("Error updating ExportProduction data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Export</h2>
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
            <h3 className="font-semibold">{selectedModelData.category}</h3>
            <h3 className="font-semibold">{selectedModelData.client}</h3>
          </div>
        </div>
      )}
      {selectedModel && (
        <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-3 rounded border">
          <h3 className="font-semibold">Production</h3>
          <div className="flex items-center">
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
              onClick={() => handleChange("prev", "production")}
              disabled={isButtonDisabled}
            >
              -
            </button>
            <Input
              handleChange={(name, value) => onChange("production", value)}
              name={"production"}
              placeholder="Total Production"
              text={production}
            />
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
              onClick={() => handleChange("next", "production")}
              disabled={isButtonDisabled}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportProduction;
