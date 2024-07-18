import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../ui/Input";
import Button from "../ui/Button";

const PlastiqueAndFil = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [plastiqueReal, setPlastiqueReal] = useState(0);
  const [filReal, setFilReal] = useState(0);
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
    const fetchData = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(`/plastique_fil/${selectedModel}`);
          setPlastiqueReal(response.data.plastiqueReal || 0);
          setFilReal(response.data.filReal || 0);
        } catch (error) {
          setPlastiqueReal(0);
          setFilReal(0);
          console.error("Error fetching Plastique and Fil data:", error);
        }
      }
    };

    fetchData();
  }, [selectedModel]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChange = (name, value) => {
    if (name === "plastiqueReal") {
      setPlastiqueReal(parseInt(value, 10) || 0);
    } else if (name === "filReal") {
      setFilReal(parseInt(value, 10) || 0);
    }
  };

  const handleSave = async () => {
    setIsButtonDisabled(true);
    try {
      await api.post(`/plastique_fil/${selectedModel}`, {
        plastiqueReal,
        filReal,
      });
      toast.success("Data saved successfully");
    } catch (error) {
      toast.error("Error saving data");
      console.error("Error saving Plastique and Fil data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plastique and Fil Real</h2>
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
        </div>
      )}
      {selectedModel && (
        <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-10 rounded border">
          <div className="mt-5">
            <Input
              handleChange={(name, value) =>
                handleChange("plastiqueReal", value)
              }
              name={"plastiqueReal"}
              label="Plastique Real"
              text={plastiqueReal}
            />
          </div>
          <div className="mt-7">
            <Input
              handleChange={(name, value) => handleChange("filReal", value)}
              name={"filReal"}
              label="Fil Real"
              text={filReal}
            />
          </div>
          <Button
            classes={"bg-blue-500 mt-10"}
            handlePress={handleSave}
            disabled={isButtonDisabled}
            container={"w-full"}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlastiqueAndFil;
