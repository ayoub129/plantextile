import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExportProduction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [production, setProduction] = useState(0);
  const [encore, setEncore] = useState(0);
  const [entre, setEntre] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
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
          const controlResponse = await api.get(
            `/magasin_production/${selectedModel}`
          );
          setEntre(controlResponse.data.value);
          setEncore(controlResponse.data.value);
        } catch (error) {
          console.error("Error fetching controle data:", error);
        }

        try {
          const response = await api.get(`/export/${selectedModel}`);
          setProduction(response.data.value);
          setSelectedDate(new Date(response.data.date));
          setEncore(entre - parseInt(response.data.value));
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onChange = (name, value) => {
    const newValue = parseInt(value, 10) || 0;
    const newEncore = entre - newValue;

    if (newEncore < 0) {
      toast.error("Encore cannot be less than 0");
      return;
    }

    setProduction(newValue);
    setEncore(newEncore);
  };

  const handleSave = async () => {
    if (encore < 0) {
      toast.error("Encore cannot be less than 0");
      return;
    }

    if (production == null) {
      toast.error("Production value is required");
      return;
    }

    if (selectedDate == null) {
      toast.error("Date is required");
      return;
    }

    setIsButtonDisabled(true);

    try {
      await api.post(`/export/${selectedModel}`, {
        value: production,
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
      });
      toast.success("Data saved successfully");
    } catch (error) {
      console.error("Error updating ExportProduction data:", error);
      toast.error("Failed to update production data.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
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
      <div className="w-full pr-6">
        {selectedModelData && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Encore: {encore}</h3>
          </div>
        )}
      </div>
      {selectedModel && (
        <div className="flex justify-between items-center mx-auto mt-[2rem] mb-4 shadow-md max-w-[500px] p-5 rounded border">
          <div>
            <h3 className="font-semibold">Production</h3>
            <Input
              handleChange={(name, value) => onChange("production", value)}
              name={"production"}
              placeholder="Total Production"
              text={production ? production.toString() : "0"}
            />
          </div>
          <div className="font-semibold">
            <label className="block">Date d'export</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>
        </div>
      )}
      {selectedModel && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
            disabled={isButtonDisabled}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportProduction;
