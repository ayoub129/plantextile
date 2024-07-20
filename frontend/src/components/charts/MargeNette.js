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

  const [couteDeRevient, setCouteDeRevient] = useState(0);
  const [realFils, setRealFils] = useState(0);
  const [realPlastique, setRealPlastique] = useState(0);
  const [estimationFils, setEstimationFils] = useState(0);
  const [estimationPlastique, setEstimationPlastique] = useState(0);
  const [massSalary, setMassSalary] = useState(0);
  const [massSalaryDirect, setMassSalaryDirect] = useState(0);
  const [massSalaryInDirect, setMassSalaryInDirect] = useState(0);
  const [mass16Indirect, setMass16Indirect] = useState(0);
  const [mass17Indirect, setMass17Indirect] = useState(0);
  const [mass175Indirect, setMass175Indirect] = useState(0);
  const [mass16Direct, setMass16Direct] = useState(0);
  const [mass17Direct, setMass17Direct] = useState(0);
  const [mass175Direct, setMass175Direct] = useState(0);
  const [mass16percentage, setMass16percentage] = useState(0);
  const [mass17percentage, setMass17percentage] = useState(0);
  const [mass175percentage, setMass175percentage] = useState(0);
  const [mass16hour, setMass16hour] = useState(0);
  const [mass17hour, setMass17hour] = useState(0);
  const [mass175hour, setMass175hour] = useState(0);
  const [effectifDirect, setEffectifDirect] = useState(0);
  const [effectifInDirect, setEffectifInDirect] = useState(0);

  const [transIndirect, setTransIndirect] = useState();
  const [transDirect, setTransDirect] = useState();
  const [transport, setTransport] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalHour, setTotalHour] = useState(null);
  const [totalHourIndirect, setTotalHourIndirect] = useState(null);
  const [congeDirect, setCongeDirect] = useState(0);
  const [congeInDirect, setCongeInDirect] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);

  const [barChartData, setBarChartData] = useState({
    labels: ["Production dépôt en valeur", "Coût de revient", "La marge nette"],
    datasets: [
      {
        data: [0, 0, 0],
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
          text: "Stage",
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

  const CalculateEstimation = (type) => {
    if (type == "plastique") {
      const estimationPlastique = (+totalPieces * (15000 / 18600)).toFixed(2);
      setEstimationPlastique(estimationPlastique);
    } else {
      const estimationFils = (+totalPieces * (20000 / 18600)).toFixed(2);
      setEstimationFils(estimationFils);
    }
  };

  const CalculatebTotalHours = (type) => {
    if (type == "indirect") {
      const qp = effectifInDirect / totalChains;
      setTotalHourIndirect(qp * 9);
      setTransIndirect((totalHourIndirect * (80 / 208)).toFixed(2));
    } else {
      setTotalHour(9 * effectifDirect);
      setTransDirect(((totalHour * 80) / 208).toFixed(2));
    }
  };

  const CalculateConge = (type) => {
    if (type == "indirect") {
      setCongeInDirect(((totalHourIndirect * 1.5 * 8) / (26 * 8)).toFixed(2));
    } else {
      setCongeDirect(((totalHour * 1.5 * 8) / (26 * 8)).toFixed(2));
    }
  };

  const CalculateSalaries = (type) => {
    if (type == "direct") {
      setMass16Direct((mass16hour * mass16percentage * totalHour).toFixed(2));
      setMass17Direct((mass17hour * mass17percentage * totalHour).toFixed(2));
      setMass175Direct(
        (mass175hour * mass175percentage * totalHour).toFixed(2)
      );
      setMassSalaryDirect(
        mass16Direct + mass17Direct + mass175Direct + congeDirect
      );
    } else {
      setMass16Indirect(
        (mass16hour * mass16percentage * totalHourIndirect).toFixed(2)
      );
      setMass17Indirect(
        (mass17hour * mass17percentage * totalHourIndirect).toFixed(2)
      );
      setMass175Indirect(
        (mass175hour * mass175percentage * totalHourIndirect).toFixed(2)
      );
      setMassSalaryInDirect(
        mass16Indirect + mass17Indirect + mass175Indirect + congeInDirect
      );
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
        const systemResponse = await api.get("/system_constants_latest");
        if (systemResponse.data) {
          const { id, created_at, updated_at, effectif_fix, ...filteredData } =
            systemResponse.data;

          setSystemConstant({
            ...filteredData,
          });
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    const fetchSalaries = async () => {
      try {
        const response = await api.get("/salaries");
        setMass16percentage(response.data.Masse_salariale_16_29);
        setMass17percentage(response.data.Masse_salariale_17_00);
        setMass175percentage(response.data.Masse_salariale_17_50);
        setMass16hour(response.data.Taux_horaire_SMIG_16_29);
        setMass17hour(response.data.Taux_horaire_17_00);
        setMass175hour(response.data.Taux_horaire_17_50);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTotalworkers = async () => {
      try {
        const response = await api.get(`/effective_indirect`);
        const responseDirect = await api.get(
          `/effective_direct_real/${selectedModel}`
        );

        setEffectifInDirect(parseInt(response.data.total_effectif_indirect));
        setEffectifDirect(parseInt(responseDirect.data.total_effectif_direct));
        CalculatebTotalHours("indirect");
        CalculatebTotalHours("direct");
        setTransport(transDirect + transIndirect);
        CalculateConge("indirect");
        CalculateConge("direct");
        CalculateSalaries("direct");
        CalculateSalaries("indirect");
        setMassSalary(massSalaryDirect + massSalaryInDirect);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTotalPiecesInDepot = async () => {
      try {
        const response = await api.get(`/export/${selectedModel}`);
        setTotalPieces(response.data.value);
        CalculateEstimation("plastique");
        CalculateEstimation("fils");
      } catch (error) {
        console.log("Error Happened");
      }
    };

    fetchSalaries();
    fetchModels();
    if (selectedModel) {
      fetchTotalworkers();
      fetchTotalPiecesInDepot();
    }
  }, [selectedModel]);

  const handleSelectChange = (e) => {
    setSelectedModel(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (modelId) => {
    try {
      setError(null);
      const response = await api.get(`/export/${modelId}`);
      const exportData = response.data;

      const modelData = models.find((model) => {
        return model.id == modelId;
      });

      // Assuming modelData contains the required values for the chart
      setBarChartData({
        labels: [
          "Production dépôt en valeur",
          "Coût de revient",
          "La marge nette",
        ],
        datasets: [
          {
            data: [
              (
                modelData.prixMOver *
                (modelData.prixFacture /
                  (modelData.prixMOver * modelData.qte_societe)) *
                exportData.value
              ).toFixed(2),
            ],
            backgroundColor: ["rgba(75,192,192,0.2)"],
            borderColor: ["rgba(75,192,192,1)"],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
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
    </div>
  );
};

export default MargeNette;
