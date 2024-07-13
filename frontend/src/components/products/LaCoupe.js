import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";

const LaCoupe = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [value, setValue] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  console.log(models);

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
    const fetchCoupeProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(`/coupe_production/${selectedModel}`);
          setValue(response.data.value);
        } catch (error) {
          console.error("Error fetching CoupeProduction data:", error);
        }
      }
    };

    fetchCoupeProduction();
  }, [selectedModel]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const onChange = (name, value) => {
    setValue(parseInt(value, 10));
  };

  const handleChange = async (direction) => {
    let newValue = value;
    if (direction === "next") {
      newValue += 1;
    } else if (direction === "prev" && value > 0) {
      newValue -= 1;
    }

    setValue(newValue);
    setIsButtonDisabled(true);

    try {
      await api.post(`/coupe_production/${selectedModel}`, {
        value: newValue,
      });
    } catch (error) {
      console.error("Error updating CoupeProduction data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);
  console.log("Selected Model:", selectedModel);
  console.log("Selected Model Data:", selectedModelData);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">La coupe</h2>
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
          <h3 className="font-semibold">
            encour: {selectedModelData.qte_societe - value}
          </h3>
        </div>
      )}
      {selectedModel && (
        <div className="flex justify-center mx-auto mt-[2rem] items-center mb-4 shadow-md w-fit p-1 rounded border">
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
            onClick={() => handleChange("prev")}
            disabled={isButtonDisabled}
          >
            -
          </button>
          <Input
            handleChange={onChange}
            name={"coupe"}
            placeholder="Total Coupe"
            text={value}
          />
          <button
            className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
            onClick={() => handleChange("next")}
            disabled={isButtonDisabled}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default LaCoupe;
