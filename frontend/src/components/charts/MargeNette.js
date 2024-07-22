import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import BarChart from "../ui/BarChart";

const MargeNette = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
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

  const [effectifDirect, setEffectifDirect] = useState(0);
  const [effectifInDirect, setEffectifInDirect] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [couteTransport, setCouteTransport] = useState(0);
  const [massSalaryDirect, setMassSalaryDirect] = useState(0);
  const [massSalaryInDirect, setMassSalaryInDirect] = useState(0);
  const [totalMassSalary, setTotalMassSalary] = useState(0);
  const [totalExport, setTotalExport] = useState(0);
  const [fils, setFils] = useState(0);
  const [plastique, setPlastique] = useState(0);
  const [coûtEnergie, setCoûtEnergie] = useState(0);
  const [coûtChargesFixes, setCoûtChargesFixes] = useState(0);
  const [coûtDeRevient, setCoûtDeRevient] = useState(0);
  const [productionDepotValeur, setProductionDepotValeur] = useState(0);
  const [margeBruteDepot, setMargeBruteDepot] = useState(0);
  const [margeNetteDepot, setMargeNetteDepot] = useState(0);
  const [barChartData, setBarChartData] = useState({
    labels: ["Production dépôt en valeur", "Coût de revient", "Marge brute dépôt", "Marge nette dépôt"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(75,192,192,0.2)"],
        borderColor: ["rgba(75,192,192,1)"],
        borderWidth: 1,
      },
    ],
  });

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Chain",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  const fetchData = async (modelId) => {
    try {
      setError(null);
      const response = await api.get(`/export/${modelId}`);
      const exportData = response.data;
      setTotalExport(exportData.value);

      const modelData = models.find((model) => {
        return model.id == modelId;
      });

      const productionDepotValeur = (
        modelData.prixMOver *
        (modelData.prixFacture /
          (modelData.prixMOver * modelData.qte_societe)) *
        exportData.value
      ).toFixed(2);

      setProductionDepotValeur(productionDepotValeur);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const calculateCouteTransport = () => {
    const QP_effectif = effectifInDirect / totalChains;
    const { Nombre_d_heures_par_jour, Capacité_par_unité_transport, Coût_par_trajet } = systemConstant;

    const Nombre_de_jours_de_production = totalHours / Nombre_d_heures_par_jour;

    const Refacturation_transport_MOD_directe = -((totalHours * effectifDirect) / 26 * 8);
    const Refacturation_transport_MOD_indirecte = -((totalHours * QP_effectif) / 26 * 8);

    const transportCost = (2 * ((QP_effectif + effectifDirect) / Capacité_par_unité_transport) * Nombre_de_jours_de_production * Coût_par_trajet) 
      + Refacturation_transport_MOD_directe 
      + Refacturation_transport_MOD_indirecte;

    setCouteTransport(transportCost.toFixed(2));
  };

  const calculateTotalMasseSalariale = () => {
    const { Taux_horaire_SMIG_16_29, Masse_salariale_16_29, Masse_salariale_17_00, Masse_salariale_17_50 } = systemConstant;

    const congeAnual = (totalHours * Taux_horaire_SMIG_16_29 * 1.5) / 26;

    const masseSalariale1629 = totalHours * Masse_salariale_16_29 * Taux_horaire_SMIG_16_29;
    const masseSalariale1700 = totalHours * Masse_salariale_17_00 * systemConstant.Taux_horaire_17_00;
    const masseSalariale1750 = totalHours * Masse_salariale_17_50 * systemConstant.Taux_horaire_17_50;

    const masseSalarialeIndirecte = masseSalariale1629 + masseSalariale1700 + masseSalariale1750 + congeAnual;
    const masseSalarialeDirecte = effectifDirect * totalHours * Taux_horaire_SMIG_16_29;

    setMassSalaryInDirect(masseSalarialeIndirecte.toFixed(2));
    setMassSalaryDirect(masseSalarialeDirecte.toFixed(2));
    setTotalMassSalary((masseSalarialeIndirecte + masseSalarialeDirecte).toFixed(2));
  };

  const calculateCouteFilAndPlastique = () => {
    setFils(totalExport * (20000 / 18602));
    setPlastique(totalExport * (15000 / 18602));
  };

  const calculateCoûtEnergie = () => {
    const { Coût_énergie_journalier } = systemConstant;
    const Nombre_de_jours_de_production = totalHours / systemConstant.Nombre_d_heures_par_jour;
    setCoûtEnergie(Nombre_de_jours_de_production * Coût_énergie_journalier);
  };

  const calculateCoûtChargesFixes = () => {
    const { Coût_charges_fixes_journalier } = systemConstant;
    const Nombre_de_jours_de_production = totalHours / systemConstant.Nombre_d_heures_par_jour;
    setCoûtChargesFixes(Nombre_de_jours_de_production * Coût_charges_fixes_journalier);
  };

  const calculateCoûtDeRevient = () => {
    const totalCost = 
      parseFloat(fils) +
      parseFloat(plastique) +
      parseFloat(totalMassSalary) +
      parseFloat(couteTransport) +
      parseFloat(coûtChargesFixes) +
      parseFloat(coûtEnergie);
    setCoûtDeRevient(totalCost.toFixed(2));
    return totalCost;
  };

  const calculateMargeBruteDepot = () => {
    const coûtDeRevient = calculateCoûtDeRevient();
    const margeBrute = parseFloat(productionDepotValeur) - coûtDeRevient;
    setMargeBruteDepot(margeBrute.toFixed(2));
    return margeBrute;
  };

  const calculateMargeNetteDepot = () => {
    const margeBruteDepot = calculateMargeBruteDepot();
    const margeNette = margeBruteDepot - (margeBruteDepot * 0.2);
    setMargeNetteDepot(margeNette.toFixed(2));
    return margeNette;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelsResponse = await api.get("/models");
        setModels(modelsResponse.data);

        const systemResponse = await api.get("/system_constants_latest");
        if (systemResponse.data) {
          const { id, created_at, updated_at, effectif_fix, ...filteredData } = systemResponse.data;
          setSystemConstant({
            ...filteredData,
          });
        }

        const responseIndirect = await api.get(`/effective_indirect`);
        const responseDirect = await api.get(`/effective_direct_real/${selectedModel}`);
        const responseChains = await api.get(`/total_chain`);

        setEffectifInDirect(parseInt(responseIndirect.data.total_effectif_indirect));
        setEffectifDirect(parseInt(responseDirect.data.total_effectif_direct));
        setTotalChains(parseInt(responseChains.data.total_chains));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedModel]);

  useEffect(() => {
    if (totalHours > 0 && effectifDirect > 0 && effectifInDirect > 0 && totalChains > 0 && systemConstant.Nombre_d_heures_par_jour) {
      calculateCouteTransport();
      calculateTotalMasseSalariale();
      calculateCouteFilAndPlastique(); 
      calculateCoûtEnergie();
      calculateCoûtChargesFixes();
    }
  }, [totalHours, effectifDirect, effectifInDirect, totalChains, systemConstant]);

  useEffect(() => {
    if (selectedModel) {
      fetchWorkedHours(selectedModel);
    }
  }, [selectedModel]);

  useEffect(() => {
    const coûtDeRevient = calculateCoûtDeRevient();
    const margeBruteDepot = calculateMargeBruteDepot();
    const margeNetteDepot = calculateMargeNetteDepot();

    setBarChartData({
      labels: [
        "Production dépôt en valeur",
        "Coût de revient",
        "Marge brute dépôt",
        "Marge nette dépôt",
      ],
      datasets: [
        {
          data: [
            productionDepotValeur,
            coûtDeRevient,
            margeBruteDepot,
            margeNetteDepot,
          ],
          backgroundColor: ["rgba(75,192,192,0.2)"],
          borderColor: ["rgba(75,192,192,1)"],
          borderWidth: 1,
        },
      ],
    });
  }, [fils, plastique, totalMassSalary, couteTransport, coûtChargesFixes, coûtEnergie]);

  const handleSelectChange = (e) => {
    setSelectedModel(e.target.value);
    fetchData(e.target.value);
  };


  return (
    <div className="ml-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">La Marge Nette</h2>
        <div className="ml-7 mb-4 pr-6">
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleSelectChange}
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
      <div className="w-full mr-5">
        {error ? (
          <div className="text-red-500 ml-7">{error}</div>
        ) : (
          <BarChart data={barChartData} options={barChartOptions} />
        )}
      </div>
      <div className="mt-4">
        <h3>Coute Transport: {couteTransport}</h3>
        <h3>Masse Salariale Directe: {massSalaryDirect}</h3>
        <h3>Masse Salariale Indirecte: {massSalaryInDirect}</h3>
        <h3>Total Masse Salariale: {totalMassSalary}</h3>
        <h3>Worked Hours: {totalHours}</h3>
        <h3>Coût Energie: {coûtEnergie}</h3>
        <h3>Coût Charges Fixes: {coûtChargesFixes}</h3>
        <h3>Coût de Revient: {coûtDeRevient}</h3>
        <h3>Marge Brute Dépôt: {margeBruteDepot}</h3>
        <h3>Marge Nette Dépôt: {margeNetteDepot}</h3>
      </div>
    </div>
  );
};

export default MargeNette;
