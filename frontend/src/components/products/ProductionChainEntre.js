import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductionChainEntre = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [encour, setEncour] = useState(0);
  const [entre, setEntre] = useState(0);

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

  useEffect(() => {
    const fetchEncoure = async () => {
      if (selectedModel) {
        try {
          const encour = await api.get(`coupe_production/${selectedModel}`);
          console.log(encour)
          const chainProd = await api.get(
            `/production_chains/${selectedModel}/entre`
          );

          setEncour(encour.data - parseInt(chainProd.data.totalEntre));
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchEncoure();
  }, [selectedModel, selectedChain]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const onChange = (name, value) => {
    const newValue = value === "" ? 0 : parseInt(value, 10);

    if (isNaN(newValue)) {
      setEntre(0);
      return;
    }

    setEntre(newValue);
  };

  const handleSave = async () => {
    const selectedModelData = models.find((model) => model.id == selectedModel);
    const encourValue = encour - entre;

    if (encourValue < 0) {
      toast.error("Encour ne peut pas être inférieur à 0.");
      return;
    }

    try {
      await api.post(`/chain_production/${selectedModel}/${selectedChain}`, {
        entre: entre,
      });
      setEncour(encourValue);
      setEntre(0);  // Reset the input value after saving
      toast.success("Record saved successfully");
    } catch (error) {
      console.error("Error saving production data:", error);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Production Entre Chain</h2>
        <div className="ml-7 mb-4 pr-6 flex items-center w-[325px] justify-between">
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
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
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedChain}
            onChange={handleChainChange}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModelData && selectedChain && (
        <div className="w-full pr-6">
          <div
            key={selectedModelData.id}
            className="flex items-center justify-between"
          >
            <h3 className="font-semibold text-xl">
              {selectedModelData.category}
            </h3>
            <h3 className="font-semibold text-xl">
              {selectedModelData.client}
            </h3>
          </div>
          <h3 className="font-semibold text-xl">encour: {encour}</h3>
        </div>
      )}
      <div className="flex justify-between items-center">
        {selectedModel && selectedChain && (
          <div className="flex flex-col p-5 mt-[2rem] mb-4 shadow-md w-fit p-1 rounded border">
            <Input
              handleChange={onChange}
              name={"entre"}
              label="Total Entre"
              text={entre}
            />
            <button
              onClick={handleSave}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionChainEntre;