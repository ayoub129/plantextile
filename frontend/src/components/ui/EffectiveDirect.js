import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../ui/Input";
import Button from "../ui/Button";

const EffectiveDirect = ({ url = "effective_standard" }) => {
  const [data, setData] = useState({
    chain: "",
    model: "",
    machinistes: "",
    machinistes_stagiaires: "",
    repassage_preparation: "",
    trassage: "",
    transport: "",
    chef: "",
    machines_speciales: "",
    trassage_special: "",
    controle_table: "",
    controle_final: "",
    machinistes_retouche: "",
    repassage_final: "",
    finition: "",
    transp_fin: "",
    start_date: "",
    end_date: "",
    cointa: "",
    price_by_part: "",
  });

  const [chains, setChains] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [effectiveStandardId, setEffectiveStandardId] = useState(null);

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

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);
    setData({
      ...data,
      [name]: adjustedDate,
    });
  };

  const handleModelChange = async (e) => {
    const model = e.target.value;
    setData((prevData) => ({
      ...prevData,
      model: model,
    }));
  };

  useEffect(() => {
    const checkExisted = async () => {
      if (
        url === "effective_standard" &&
        data.model &&
        data.chain &&
        data.start_date &&
        data.end_date
      ) {
        try {
          const response = await api.get(`/effective_real_date/${data.model}`, {
            params: {
              start_date: data.start_date.toISOString().split("T")[0],
              end_date: data.end_date.toISOString().split("T")[0],
              chain: data.chain,
            },
          });

          if (response.data) {
            const effectiveRealData = response.data;
            const effectifDirects =
              effectiveRealData.effectif_directs[0] || null;

            if (effectifDirects != null) {
              setData({
                chain: effectiveRealData.chain || "",
                model: effectiveRealData.model,
                machinistes: effectifDirects.machinistes || "",
                machinistes_stagiaires:
                  effectifDirects.machinistes_stagiaires || "",
                repassage_preparation:
                  effectifDirects.repassage_preparation || "",
                trassage: effectifDirects.trassage || "",
                transport: effectifDirects.transport || "",
                chef: effectifDirects.chef || "",
                machines_speciales: effectifDirects.machines_speciales || "",
                trassage_special: effectifDirects.trassage_special || "",
                controle_table: effectifDirects.controle_table || "",
                controle_final: effectifDirects.controle_final || "",
                machinistes_retouche:
                  effectifDirects.machinistes_retouche || "",
                repassage_final: effectifDirects.repassage_final || "",
                finition: effectifDirects.finition || "",
                transp_fin: effectifDirects.transp_fin || "",
                start_date: effectiveRealData.start_date || "",
                end_date: effectiveRealData.end_date || "",
                cointa: effectiveRealData.cointa || "",
                price_by_part: effectiveRealData.price_by_part || "",
              });

              setEffectiveStandardId(effectiveRealData.id);
            } else {
              setEffectiveStandardId(null);
            }
          } else {
            setEffectiveStandardId(null);
          }
        } catch (error) {
          setEffectiveStandardId(null);
        }
      }
    };

    checkExisted();
  }, [data.model, data.start_date, data.end_date]);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formattedData = {
      start_date: data.start_date
        ? data.start_date.toISOString().split("T")[0]
        : "",
      end_date: data.end_date ? data.end_date.toISOString().split("T")[0] : "",
      cointa: data.cointa,
      price_by_part: data.price_by_part,
      chain: data.chain,
      model: data.model,
      effectif_directs: [
        {
          machinistes: data.machinistes,
          machinistes_stagiaires: data.machinistes_stagiaires,
          repassage_preparation: data.repassage_preparation,
          trassage: data.trassage,
          transport: data.transport,
          chef: data.chef,
          machines_speciales: data.machines_speciales,
          trassage_special: data.trassage_special,
          controle_table: data.controle_table,
          controle_final: data.controle_final,
          machinistes_retouche: data.machinistes_retouche,
          repassage_final: data.repassage_final,
          finition: data.finition,
          transp_fin: data.transp_fin,
        },
      ],
      effectif_indirects: [],
    };

    try {
      if (effectiveStandardId) {
        await api.post(`/${url}/${effectiveStandardId}`, formattedData);
        toast.success("Données mises à jour avec succès.");
      } else {
        await api.post(`/${url}`, formattedData);
        toast.success("Données enregistrées avec succès.");
      }
      setData({
        chain: "",
        model: "",
        machinistes: "",
        machinistes_stagiaires: "",
        repassage_preparation: "",
        trassage: "",
        transport: "",
        chef: "",
        machines_speciales: "",
        trassage_special: "",
        controle_table: "",
        controle_final: "",
        machinistes_retouche: "",
        repassage_final: "",
        finition: "",
        transp_fin: "",
        start_date: "",
        end_date: "",
        cointa: "",
        price_by_part: "",
      });
      setEffectiveStandardId(null);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des données.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/${url}/${effectiveStandardId}`);
      toast.success("Données supprimées avec succès.");
      setData({
        chain: "",
        model: "",
        machinistes: "",
        machinistes_stagiaires: "",
        repassage_preparation: "",
        trassage: "",
        transport: "",
        chef: "",
        machines_speciales: "",
        trassage_special: "",
        controle_table: "",
        controle_final: "",
        machinistes_retouche: "",
        repassage_final: "",
        finition: "",
        transp_fin: "",
        start_date: "",
        end_date: "",
        cointa: "",
        price_by_part: "",
      });
      setEffectiveStandardId(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression des données.", error);
    }
  };

  return (
    <div className="ml-[16.66%] mr-5 pt-[6rem]">
      <ToastContainer />
      <form className="ml-7" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold my-5 mb-[3rem]">
          {url === "effective_real"
            ? "Effectif Réel Direct"
            : "Effectif Standard Direct"}
        </h2>
        <div className="mb-4">
          <label className="block font-semibold">Chaîne</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => onChange("chain", e.target.value)}
          >
            <option value="">Sélectionner une chaîne</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Modèle</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.model}
            onChange={handleModelChange}
          >
            <option value="">Sélectionner un modèle</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>

        {url === "effective_standard" && (
          <>
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
          </>
        )}

        <div className="mb-4">
          <label className="block font-semibold">Quenta</label>
          <div className="mt-4">
            <label className="mr-4">
              <input
                type="radio"
                name="cointa"
                value={true}
                checked={data.cointa === true || data.cointa === "true"}
                onChange={(e) => onChange("cointa", e.target.value === "true")}
              />
              Oui
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="cointa"
                value={false}
                checked={data.cointa === false || data.cointa === "false"}
                onChange={(e) => onChange("cointa", e.target.value === 0)}
              />
              Non
            </label>
          </div>
        </div>

        {data.cointa && data.cointa !== "false" && (
          <Input
            container="mb-4"
            label="Prix par pièce"
            type="number"
            name="price_by_part"
            text={data.price_by_part}
            handleChange={onChange}
          />
        )}

        <Input
          container="mb-4"
          label="Machinistes"
          type="number"
          name="machinistes"
          text={data.machinistes}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machinistes Stagiaires"
          type="number"
          name="machinistes_stagiaires"
          text={data.machinistes_stagiaires}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage Préparation"
          type="number"
          name="repassage_preparation"
          text={data.repassage_preparation}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Trassage"
          type="number"
          name="trassage"
          text={data.trassage}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Transport"
          type="number"
          name="transport"
          text={data.transport}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Chef"
          type="number"
          name="chef"
          text={data.chef}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machines Spéciales"
          type="number"
          name="machines_speciales"
          text={data.machines_speciales}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Trassage Spécial"
          type="number"
          name="trassage_special"
          text={data.trassage_special}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Contrôle Table"
          type="number"
          name="controle_table"
          text={data.controle_table}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Contrôle Final"
          type="number"
          name="controle_final"
          text={data.controle_final}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machinistes Retouche"
          type="number"
          name="machinistes_retouche"
          text={data.machinistes_retouche}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage Final"
          type="number"
          name="repassage_final"
          text={data.repassage_final}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Finition"
          type="number"
          name="finition"
          text={data.finition}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Transport Fin"
          type="number"
          name="transp_fin"
          text={data.transp_fin}
          handleChange={onChange}
        />

        <Button classes="bg-blue-500 my-5 mb-8">
          {loading ? "Enregistrement ..." : "Enregistrer Effectif Direct"}
        </Button>

        {effectiveStandardId && (
          <Button classes="bg-red-500 my-5 mb-8" onClick={handleDelete}>
            Supprimer Effectif Direct
          </Button>
        )}
      </form>
    </div>
  );
};

export default EffectiveDirect;
