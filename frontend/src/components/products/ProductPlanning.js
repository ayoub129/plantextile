import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
    consummation_standard_fil: null,
    consummation_standard_plastique: null,
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
  const [sum , setSum] = useState(null);
  const [systemConstant, setSystemConstant] = useState({
    Nombre_d_heures_par_jour: "",
    Taux_horaire_SMIG_16_29: "",
    Taux_horaire_17_00: "",
    Taux_horaire_17_50: "",
    Masse_salariale_16_29: "",
    Masse_salariale_17_00: "",
    Masse_salariale_17_50: "",
    Capacité_par_unité_transport: "",
    cotisation_entroprise_trans: "",
    Coût_par_trajet: "",
    Coût_énergie_journalier: "",
    Coût_charges_fixes_journalier: "",
  });
  const [totalChains, setTotalChains] = useState(0);
  const [effectifInDirect, setEffectifInDirect] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [fils, setFils] = useState(0);
  const [plastique, setPlastique] = useState(0);
  const [totalExport, setTotalExport] = useState(0);
  const [effectifDirect, setEffectifDirect] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taux , setTaux] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseChains = await api.get(`/total_chain`);
        const responseIndirect = await api.get(`/effective_indirect_total`);
        const systemResponse = await api.get("/system_constants_latest");
        if(data.model_id) {
          const responseDirect = await api.get(
            `/effective_direct_standard/${data.model_id}`
          );
          setEffectifDirect(parseInt(responseDirect.data.total_effectif_direct));
        }

        if (systemResponse.data) {
          const { id, created_at, updated_at, effectif_fix, ...filteredData } =
            systemResponse.data;
          setSystemConstant({
            ...filteredData,
          });
        }

        setEffectifInDirect(
          parseInt(responseIndirect.data.total_effectif_indirect)
        );
        setTotalChains(parseInt(responseChains.data.total_chains));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [data.model_id ])

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

    const fetchSum = async () => {
      try {
        const response = await api.get(`/product_plans_worked/${data.model_id}`)
        setSum(response.data.total_finished_models);
      } catch (error) {
        console.log(error)
      }
    }


    if (!isEditing) {
      fetchPlanning();
      fetchSum();
    }
  }, [data.model_id, data.chain, models , isEditing]);

  const handleSubmit = async (event) => {
    setSubLoading(true);
    event.preventDefault();

    if (parseFloat(data.qte) + parseFloat(sum) > parseFloat(qteSociete)) {
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
      console.log(error)
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
      consummation_standard_fil: null,
      consummation_standard_plastique: null,
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

  const fetchWorkedHours = async (modelId) => {
    try {
      const response = await api.get(`/product_plans_worked_hours/${modelId}`);
      setTotalHours(response.data.worked_hours_count);
    } catch (error) {
      console.error("Error fetching worked hours:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const calculateCouteFilAndPlastique = () => {
    setFils(planningData.consummation_standard_fil);
    setPlastique(planningData.consummation_standard_plastique);
  };

  const fetchData = async (modelId) => {
    try {
      const response = await api.get(`/export/${modelId}`);
      const exportData = response.data;
      setTotalExport(exportData.total);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (data.model_id) {
      fetchWorkedHours(data.model_id);
      fetchData(data.model_id);
    }
  }, [data.model_id]);

  useEffect(() => {
    if (
      totalHours > 0 &&
      effectifDirect > 0 &&
      effectifInDirect > 0 &&
      totalChains > 0 &&
      systemConstant.Nombre_d_heures_par_jour
    ) {
      calculateCouteFilAndPlastique();
    }
  }, [
    totalHours,
    effectifDirect,
    effectifInDirect,
    totalChains,
    totalExport,
    systemConstant,
  ]);


  const handleTest = () => {
    if (
      totalHours > 0 &&
      effectifDirect > 0 &&
      effectifInDirect > 0 &&
      totalChains > 0 &&
      systemConstant.Nombre_d_heures_par_jour
    ) {

    // Constants from systemConstant
    const {
      Nombre_d_heures_par_jour,
      Capacité_par_unité_transport,
      Coût_par_trajet,
      cotisation_entroprise_trans,
      Taux_horaire_SMIG_16_29,
      Taux_horaire_17_00,
      Taux_horaire_17_50,
      Coût_charges_fixes_journalier,
      Coût_énergie_journalier
    } = systemConstant;
  
    
    // QP effectif calculation
    const QP_effectif = effectifInDirect / totalChains;

    // Nombre de jours de production
    const Nombre_de_jours_de_production = totalHours / Nombre_d_heures_par_jour;

    // Clès de répartition des charges indirectes
    const Cles_de_repartition_charges_indirectes = totalHours / (Nombre_d_heures_par_jour * totalChains);

    // Coût de charge fixe
    const coûtChargesFixes = Coût_charges_fixes_journalier * Nombre_de_jours_de_production * Cles_de_repartition_charges_indirectes;

    // Coût achats consommés journalier
    const coûtAchatsConsommesJournalier = (parseFloat(fils) + parseFloat(plastique)) / Nombre_de_jours_de_production;

    // Coût d'achat plastique and fils
    const coûtAchatPlastiqueFils = Nombre_de_jours_de_production * coûtAchatsConsommesJournalier;

    // Coût énergie
    const coûtEnergie = Coût_énergie_journalier * Nombre_de_jours_de_production * Cles_de_repartition_charges_indirectes;

    // Nombre unités à utiliser
    const Nombre_unite_utilise = (QP_effectif + effectifDirect) / Capacité_par_unité_transport;

    // Refacturation transport MOD indirecte
    const Refacturation_transport_MOD_indirecte = -((cotisation_entroprise_trans * Nombre_de_jours_de_production * QP_effectif) / 26);

    // Refacturation transport MOD directe
    const Refacturation_transport_MOD_directe = -((cotisation_entroprise_trans * Nombre_de_jours_de_production * effectifDirect) / 26);

    // Transport
    const transportCost = (2 * Nombre_unite_utilise * Nombre_de_jours_de_production * Coût_par_trajet) + (Refacturation_transport_MOD_directe + Refacturation_transport_MOD_indirecte);
  
    // Nombre d'heures travaillées (Direct and Indirect)
    const Nombre_heures_travaillees_direct = totalHours * effectifDirect;
    const Nombre_heures_travaillees_indirect = totalHours * QP_effectif;
  
    // Congé (Direct and Indirect)
    const conge_direct = (1.5 * Nombre_heures_travaillees_direct * Taux_horaire_SMIG_16_29) / 26;
    const conge_indirect = (1.5 * Nombre_heures_travaillees_indirect * Taux_horaire_SMIG_16_29) / 26;
  
    // Masse salariale (Direct)
    const masseSalarialeDirect_1629 = Nombre_heures_travaillees_direct * systemConstant.Masse_salariale_16_29 * 0.01 * Taux_horaire_SMIG_16_29;
    const masseSalarialeDirect_1700 = Nombre_heures_travaillees_direct * systemConstant.Masse_salariale_17_00 * 0.01 * Taux_horaire_17_00;
    const masseSalarialeDirect_1750 = Nombre_heures_travaillees_direct * systemConstant.Masse_salariale_17_50 * 0.01 * Taux_horaire_17_50;
    const masseSalarialeDirect = masseSalarialeDirect_1629 + masseSalarialeDirect_1700 + masseSalarialeDirect_1750 + conge_direct;
  
    // Masse salariale (Indirect)
    const masseSalarialeIndirect_1629 = Nombre_heures_travaillees_indirect * systemConstant.Masse_salariale_16_29 * 0.01 * Taux_horaire_SMIG_16_29;
    const masseSalarialeIndirect_1700 = Nombre_heures_travaillees_indirect * systemConstant.Masse_salariale_17_00 * 0.01 * Taux_horaire_17_00;
    const masseSalarialeIndirect_1750 = Nombre_heures_travaillees_indirect * systemConstant.Masse_salariale_17_50 * 0.01 * Taux_horaire_17_50;
    const masseSalarialeIndirect = masseSalarialeIndirect_1629 + masseSalarialeIndirect_1700 + masseSalarialeIndirect_1750 + conge_indirect;
  
    // Total mass salary
    const totalMassSalary = masseSalarialeDirect + masseSalarialeIndirect;
  
    // Coût de revient par chaine
    const coûtDeRevientParChaine = coûtChargesFixes + coûtAchatPlastiqueFils + coûtEnergie + transportCost + totalMassSalary;
  
    // Chiffre d'affires par chaine
    const chiffreAffairesParChaine = planningData.qte * models.find(model => model.id === planningData.model_id).prixFacture;
  
    // Marge brute nette
    const margeBruteNette = chiffreAffairesParChaine - coûtDeRevientParChaine;

    // IS (Impot sur les sociétés)
    const IS = margeBruteNette * 0.2;
  
    // Marge nette de model
    const margeNetteDeModel = margeBruteNette - IS;
  
    // Total primes par model (assume you have a way to get this value)
    const totalPrimesParModel = 0; // Placeholder
  
    // Marge nette
    const margeNette = margeNetteDeModel - totalPrimesParModel;
  
    // Tau
    setTaux(margeNette / chiffreAffairesParChaine)
    
  }

  if (taux > 15) {
    setModalMessage("Le taux est supérieur à 15%");
  } else {
    setModalMessage("Le taux est inférieur ou égal à 15%");
  }
  setShowModal(true);

  };
    
  // Schmellow101018!!
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const sendToAdmin = async () => {
    try {
      await api.post(`/product_plans_admin/${planningDataId}` , {message: "can you accept this plan?" , taux: taux});
      setShowModal(false);
    } catch (error) {
      setModalMessage(error.message);
      setShowModal(false);
    }
  }

  return (
    <div className="md:ml-[16.66%] mr-6 pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h1 className="ml-7 mb-5 text-2xl">
          {isEditing ? "modifier la planification" : "Créer une planification"}
        </h1>
        <div className="flex items-center w-[400px] justify-between">
        {(isEditing || planningData) && 
          <>
            <Button classes={"bg-green-400"} handlePress={handleTest}>
             Test
            </Button>
            <Button classes={"bg-yellow-400"} handlePress={handleEdit}>
              modifier
            </Button>
            <Button classes={"bg-red-400"} handlePress={handleDelete}>
              Supprimer la planification
            </Button>
          </>
          }
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

    {showModal && (
        <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-xl font-semibold">{modalMessage}</p>
            <div className="flex items-center justify-end">
              {
                taux < 15 && 
                  <Button classes="bg-green-500 mt-5 " container="mr-[12px]" handlePress={sendToAdmin}>Send To Admin</Button>
              }
              <Button classes="bg-red-500 mt-5 " handlePress={handleCloseModal}>Fermer</Button>
            </div>
          </div>
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
