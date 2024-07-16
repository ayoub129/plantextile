import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "./Button";
import Input from "./Input";
import { toast, ToastContainer } from "react-toastify";

const AddConstantSystem = () => {
  const [formData, setFormData] = useState({
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
    Coupe: "",
    Production: "",
    Repassage_final: "",
    Contrôle_final: "",
    Magasin_final: "",
    Magasin_fournitures: "",
    Achats_Logistique: "",
    Transit: "",
    Comptabilité_Finances: "",
    RH: "",
    Ménage: "",
    Autres: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/system_constants_latest");
        if (response.data) {
          const { id, created_at, updated_at, effectif_fix, ...filteredData } =
            response.data;

          if (effectif_fix && effectif_fix.length > 0) {
            const {
              id,
              created_at,
              updated_at,
              system_constant_id,
              ...effectifFixData
            } = effectif_fix[0];
            setFormData({
              ...filteredData,
              ...effectifFixData,
            });
          } else {
            setFormData(filteredData);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const {
      id,
      created_at,
      updated_at,
      Coupe,
      Production,
      Repassage_final,
      Contrôle_final,
      Magasin_final,
      Magasin_fournitures,
      Achats_Logistique,
      Transit,
      Comptabilité_Finances,
      RH,
      Ménage,
      Autres,
      ...dataToSubmit
    } = formData;

    const requestData = {
      ...dataToSubmit,
      effectif_fix: [
        {
          Coupe,
          Production,
          Repassage_final,
          Contrôle_final,
          Magasin_final,
          Magasin_fournitures,
          Achats_Logistique,
          Transit,
          Comptabilité_Finances,
          RH,
          Ménage,
          Autres,
        },
      ],
    };

    try {
      await api.post("/system_constants/1", requestData); // Assuming ID 1 for the example
      toast.success("System constants Updated succesffully");
    } catch (error) {
      toast.error("Error updating system constants");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="ml-[18.5%] mr-5 mx-auto pt-[6rem]" onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.keys(formData).map((key) => (
          <Input
            key={key}
            id={key}
            name={key}
            label={key.replace(/_/g, " ")}
            text={formData[key]}
            handleChange={handleChange}
            type="number"
          />
        ))}
      </div>
      <div className="mt-4">
        <Button handlePress={handleSubmit} classes="bg-blue-500 mb-5">
          {saving ? "Saving..." : "Save Constant"}
        </Button>
      </div>
    </form>
  );
};

export default AddConstantSystem;
