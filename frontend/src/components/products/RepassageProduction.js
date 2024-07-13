import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";

const RepassageProduction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [production, setProduction] = useState(0);
  const [entre, setEntre] = useState(0);
  const [encore, setEncore] = useState(0);
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
    const fetchRepassageProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(
            `/repassage_production/${selectedModel}`
          );
          setProduction(response.data.value);
          setEntre(response.data.entre || 0);
          setEncore(response.data.encore || 0);
        } catch (error) {
          console.error("Error fetching RepassageProduction data:", error);
        }
      }
    };

    fetchRepassageProduction();
  }, [selectedModel]);

  useEffect(() => {
    setEncore(-(production - entre));
  }, [production, entre]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const onChange = (name, value) => {
    if (name === "production") {
      setProduction(parseInt(value, 10));
    } else if (name === "entre") {
      setEntre(parseInt(value, 10));
    }
  };

  const handleChange = async (direction, type) => {
    let newValue = type === "production" ? production : entre;
    if (direction === "next") {
      newValue += 1;
    } else if (direction === "prev" && newValue > 0) {
      newValue -= 1;
    }

    if (type === "production") {
      setProduction(newValue);
    } else if (type === "entre") {
      setEntre(newValue);
    }

    setIsButtonDisabled(true);

    try {
      await api.post(`/repassage_production/${selectedModel}`, {
        value: production,
        entre: entre,
        encore: -(production - entre),
      });
    } catch (error) {
      console.error("Error updating RepassageProduction data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
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
            <h3 className="font-semibold">{selectedModelData.category}</h3>
            <h3 className="font-semibold">{selectedModelData.client}</h3>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        {selectedModel && (
          <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-3 rounded border">
            <h3 className="font-semibold">Entre</h3>
            <div className="flex items-center">
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("prev", "entre")}
                disabled={isButtonDisabled}
              >
                -
              </button>
              <Input
                handleChange={(name, value) => onChange("entre", value)}
                name={"entre"}
                placeholder="Total Entre"
                text={entre}
              />
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("next", "entre")}
                disabled={isButtonDisabled}
              >
                +
              </button>
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
        {selectedModel && (
          <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-3 rounded border">
            <h3 className="font-semibold">Encore</h3>
            <div className="flex items-center">
              <Input
                name={"encore"}
                placeholder="Total Encore"
                text={encore}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepassageProduction;
