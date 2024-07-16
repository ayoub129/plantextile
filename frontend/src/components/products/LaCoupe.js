import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LaCoupe = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [value, setValue] = useState(0);

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

  const onChange = async (name, value) => {
    const newValue = value === "" ? 0 : parseInt(value, 10);

    if (isNaN(newValue)) {
      setValue(0);
      return;
    }

    const selectedModelData = models.find((model) => model.id == selectedModel);
    const encour = selectedModelData.qte_societe - newValue;

    if (encour < 0) {
      toast.error("Total Coupe can't be more than the encour");
      return;
    }

    setValue(newValue);

    try {
      await api.post(`/coupe_production/${selectedModel}`, {
        value: newValue,
      });
    } catch (error) {
      console.error("Error updating CoupeProduction data:", error);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
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
            <h3 className="font-semibold text-xl">
              {selectedModelData.category}
            </h3>
            <h3 className="font-semibold text-xl">
              {selectedModelData.client}
            </h3>
          </div>
          <h3 className="font-semibold text-xl">
            encour: {selectedModelData.qte_societe - value}
          </h3>
        </div>
      )}
      {selectedModel && (
        <div className="flex p-5 mt-[2rem] mb-4 shadow-md w-fit p-1 rounded border">
          <Input
            handleChange={onChange}
            name={"coupe"}
            label="Total Coupe"
            text={value}
          />
        </div>
      )}
    </div>
  );
};

export default LaCoupe;
