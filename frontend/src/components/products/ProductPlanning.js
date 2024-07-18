import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import FullCalendar from "./FullCalendar";
import Input from "../ui/Input";
import Button from "../ui/Button";

function ProductPlanning() {
  const [data, setData] = useState({
    model_id: "",
    chain: "",
    start_date: null,
    end_date: null,
    qte: "",
    consummation_standard_fil: "",
    consummation_standard_plastique: "",
  });
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [planningData, setPlanningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [qteSociete, setQteSociete] = useState(null);
  const [planningDataId, setPlanningDataId] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des modèles.");
      }
    };

    const fetchChains = async () => {
      try {
        const response = await api.get("/chains");
        setChains(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des chaînes.");
      }
    };

    fetchModels();
    fetchChains();
  }, []);

  useEffect(() => {
    const fetchPlanning = async () => {
      if (data.model_id && data.chain) {
        setLoading(true);
        const selectedModel = models.find(
          (model) => model.id === parseInt(data.model_id)
        );
        if (selectedModel) {
          setQteSociete(selectedModel.qte_societe);
        }
        try {
          const response = await api.get(
            `/product_plans_model/${data.model_id}/${data.chain}`
          );
          setPlanningDataId(response.data.id);
          setPlanningData(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setPlanningData(null);
          } else {
            toast.error(
              "Erreur lors de la récupération des données de planification."
            );
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (!isEditing) {
      fetchPlanning();
    }
  }, [data.model_id, data.chain, models]);

  const handleSubmit = async (event) => {
    setSubLoading(true);
    event.preventDefault();

    if (parseFloat(data.qte) > parseFloat(qteSociete)) {
      toast.error(
        "La quantité ne peut pas être supérieure à Quantité Société de modèle."
      );
      setSubLoading(false);
      return;
    }

    const formattedData = {
      ...data,
      start_date: data.start_date
        ? new Date(data.start_date).toISOString().split("T")[0]
        : null,
      end_date: data.end_date
        ? new Date(data.end_date).toISOString().split("T")[0]
        : null,
    };

    try {
      await api.post("/product_plans", formattedData);
      resetForm();
      toast.success("Planification de produit créée avec succès.");
    } catch (error) {
      toast.error(
        "Erreur lors de l'enregistrement du Planification de produit."
      );
      setError("Erreur lors de l'enregistrement du Planification de produit.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleUpdateSubmit = async (event) => {
    setSubLoading(true);
    event.preventDefault();

    if (parseFloat(data.qte) > parseFloat(qteSociete)) {
      toast.error(
        "La quantité ne peut pas être supérieure à Quantité Société de modèle."
      );
      setSubLoading(false);
      return;
    }

    const formattedData = {
      ...data,
      start_date: data.start_date
        ? new Date(data.start_date).toISOString().split("T")[0]
        : null,
      end_date: data.end_date
        ? new Date(data.end_date).toISOString().split("T")[0]
        : null,
    };

    try {
      await api.post(`/product_plans/${data.id}`, formattedData);
      resetForm();
      setIsEditing(false);
      setPlanningData(null); // Ensure the form view is shown
      toast.success("Plan produit mis à jour avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du produit.");
      setError("Erreur lors de la mise à jour du plan.");
    } finally {
      setSubLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      model_id: "",
      chain: "",
      start_date: null,
      end_date: null,
      qte: "",
      consummation_standard_fil: "",
      consummation_standard_plastique: "",
    });
    setPlanningData(null);
  };

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    setData({
      ...data,
      [name]: date,
    });
  };

  const handleEdit = async () => {
    try {
      setPlanningData(null);
      setIsEditing(true);
      const response = await api.get(`/product_plans_single/${planningDataId}`);
      const fetchedData = response.data;
      setData({
        ...fetchedData,
        start_date: fetchedData.start_date
          ? new Date(fetchedData.start_date)
          : null,
        end_date: fetchedData.end_date ? new Date(fetchedData.end_date) : null,
      });
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des données de planification."
      );
    } finally {
      setPlanningDataId(null);
    }
  };

  const handleDelete = async () => {
    if (planningData) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (planningData) {
      try {
        await api.delete(`/product_plans/${planningData.id}`);
        resetForm();
        toast.success("Plan supprimé avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la suppression du plan.");
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="md:ml-[16.66%] mr-6 pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h1 className="ml-7 mb-5 text-2xl">
          {isEditing ? "modifier la planification" : "Créer une planification"}
        </h1>
        <div className="flex items-center w-[320px] justify-between">
          <Button classes={"bg-yellow-400"} handlePress={handleEdit}>
            modifier
          </Button>
          <Button classes={"bg-red-400"} handlePress={handleDelete}>
            Supprimer la planification
          </Button>
        </div>
      </div>
      <div className="ml-7 mb-4">
        <label className="block font-semibold">model_id</label>
        <select
          className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          value={data.model_id}
          onChange={(e) => onChange("model_id", e.target.value)}
        >
          <option value="">Sélectionnez le modèle</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.modele}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-7 mb-4">
        <label className="block font-semibold">Chaîne</label>
        <select
          className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          value={data.chain}
          onChange={(e) => onChange("chain", e.target.value)}
        >
          <option value="">Sélectionnez la chaîne</option>
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="text-center font-semibold">Chargement...</p>}

      {!loading && !planningData && (
        <form
          className="ml-7"
          onSubmit={isEditing ? handleUpdateSubmit : handleSubmit}
        >
          <div className="mb-4">
            <label className="block font-semibold">Date de début</label>
            <DatePicker
              selected={data.start_date ? new Date(data.start_date) : null}
              onChange={(date) => handleDateChange(date, "start_date")}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Date de fin</label>
            <DatePicker
              selected={data.end_date ? new Date(data.end_date) : null}
              onChange={(date) => handleDateChange(date, "end_date")}
              dateFormat="yyyy-MM-dd"
              className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
            />
          </div>

          <Input
            container="mb-4"
            label="quantité"
            type="number"
            name="qte"
            text={data.qte}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Consummation Standard Fil"
            type="number"
            name="consummation_standard_fil"
            text={data.consummation_standard_fil}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Consummation Standard Plastique"
            type="number"
            name="consummation_standard_plastique"
            text={data.consummation_standard_plastique}
            handleChange={onChange}
          />

          <Button classes="bg-blue-500 my-5 mb-8">
            {subLoading
              ? "Updating ..."
              : isEditing
              ? "modifier la planification"
              : "Créer une planification"}
          </Button>
        </form>
      )}

      {planningData && !loading && !error && (
        <div className="ml-7">
          <FullCalendar
            url={"/product_plans_hours"}
            planningData={planningData}
          />
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 z-50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-xl mb-4">
              Êtes-vous sûr de vouloir supprimer ce plan ?
            </h2>
            <div className="flex justify-end">
              <Button classes="bg-red-500 w-[70px]" handlePress={confirmDelete}>
                Supprimer
              </Button>
              <Button classes="bg-gray-300 ml-3" handlePress={cancelDelete}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPlanning;
