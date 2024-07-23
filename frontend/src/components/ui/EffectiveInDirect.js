import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../ui/Input";
import Button from "../ui/Button";

const EffectiveIndirect = ({
  getIndirect = "effective_indirect_standard",
  url = "effective_standard",
}) => {
  const [data, setData] = useState({
    cointa: "",
    price_by_part: "",
    mag_four: "",
    mag_fin: "",
    machines_sp_manuelle: "",
    cont_fin: "",
    mach_retouche: "",
    repassage: "",
    gabaret: "",
    preparation_stagieres: "",
    preparation: "",
    preparation_elastique: "",
    matlasseurs: "",
    coupeurs: "",
    tiquitage: "",
    vesline: "",
  });

  const [loading, setLoading] = useState(false);
  const [effectiveStandardId, setEffectiveStandardId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  useEffect(() => {
    const checkExisted = async () => {
      try {
        const response = await api.get(getIndirect);
        if (response.data) {
          const effectiveStandardData = response.data;
          if (effectiveStandardData) {
            setData({
              cointa: effectiveStandardData.cointa || "",
              price_by_part: effectiveStandardData.price_by_part || "",
              mag_four: effectiveStandardData.mag_four || "",
              mag_fin: effectiveStandardData.mag_fin || "",
              machines_sp_manuelle:
                effectiveStandardData.machines_sp_manuelle || "",
              cont_fin: effectiveStandardData.cont_fin || "",
              mach_retouche: effectiveStandardData.mach_retouche || "",
              repassage: effectiveStandardData.repassage || "",
              gabaret: effectiveStandardData.gabaret || "",
              preparation_stagieres:
                effectiveStandardData.preparation_stagieres || "",
              preparation: effectiveStandardData.preparation || "",
              preparation_elastique:
                effectiveStandardData.preparation_elastique || "",
              matlasseurs: effectiveStandardData.coupes[0].matlasseurs || "",
              coupeurs: effectiveStandardData.coupes[0].coupeurs || "",
              tiquitage: effectiveStandardData.coupes[0].tiquitage || "",
              vesline: effectiveStandardData.coupes[0].vesline || "",
            });

            setEffectiveStandardId(effectiveStandardData.id);
          }
        } else {
          setEffectiveStandardId(null);
        }
      } catch (error) {
        setEffectiveStandardId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkExisted();
  }, [getIndirect]);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formattedData = {
      cointa: data.cointa,
      price_by_part: data.price_by_part,
      effectif_indirects: [
        {
          mag_four: data.mag_four,
          mag_fin: data.mag_fin,
          machines_sp_manuelle: data.machines_sp_manuelle,
          cont_fin: data.cont_fin,
          mach_retouche: data.mach_retouche,
          repassage: data.repassage,
          gabaret: data.gabaret,
          preparation_stagieres: data.preparation_stagieres,
          preparation: data.preparation,
          preparation_elastique: data.preparation_elastique,
          coupes: [
            {
              matlasseurs: data.matlasseurs,
              coupeurs: data.coupeurs,
              tiquitage: data.tiquitage,
              vesline: data.vesline,
            },
          ],
        },
      ],
    };

    try {
      await api.post(`/${url}`, formattedData);
      toast.success("Données enregistrées avec succès.");
      setData({
        cointa: "",
        price_by_part: "",
        mag_four: "",
        mag_fin: "",
        machines_sp_manuelle: "",
        cont_fin: "",
        mach_retouche: "",
        repassage: "",
        gabaret: "",
        preparation_stagieres: "",
        preparation: "",
        preparation_elastique: "",
        matlasseurs: "",
        coupeurs: "",
        tiquitage: "",
        vesline: "",
      });
      setEffectiveStandardId(null);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des données.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/${url}/${effectiveStandardId}`);
      toast.success("Données supprimées avec succès.");
      setData({
        cointa: "",
        price_by_part: "",
        mag_four: "",
        mag_fin: "",
        machines_sp_manuelle: "",
        cont_fin: "",
        mach_retouche: "",
        repassage: "",
        gabaret: "",
        preparation_stagieres: "",
        preparation: "",
        preparation_elastique: "",
        matlasseurs: "",
        coupeurs: "",
        tiquitage: "",
        vesline: "",
      });
      setEffectiveStandardId(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression des données.");
    }
  };

  return (
    <div className="ml-[16.66%] mr-5 pt-[6rem]">
      <ToastContainer />
      {isLoading ? (
        <div className="text-center text-2xl">Chargement...</div>
      ) : (
        <form className="ml-7" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold my-5 mb-[3rem]">
              {url === "effective_real"
                ? "Effectif Réel Indirect"
                : "Effectif Standard Indirect"}
            </h2>
            {effectiveStandardId && (
              <Button classes="bg-red-500 my-5 mb-8" onClick={handleDelete}>
                Supprimer l'Effectif Indirect
              </Button>
            )}
          </div>
          <Input
            container="mb-4"
            label="Mag Four"
            type="number"
            name="mag_four"
            text={data.mag_four}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Mag Fin"
            type="number"
            name="mag_fin"
            text={data.mag_fin}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Machines Sp Manuelle"
            type="number"
            name="machines_sp_manuelle"
            text={data.machines_sp_manuelle}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Cont Fin"
            type="number"
            name="cont_fin"
            text={data.cont_fin}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Mach Retouche"
            type="number"
            name="mach_retouche"
            text={data.mach_retouche}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Repassage"
            type="number"
            name="repassage"
            text={data.repassage}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Gabaret"
            type="number"
            name="gabaret"
            text={data.gabaret}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Préparation Stagiaires"
            type="number"
            name="preparation_stagieres"
            text={data.preparation_stagieres}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Préparation"
            type="number"
            name="preparation"
            text={data.preparation}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Préparation Élastique"
            type="number"
            name="preparation_elastique"
            text={data.preparation_elastique}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Matlasseurs"
            type="number"
            name="matlasseurs"
            text={data.matlasseurs}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Coupeurs"
            type="number"
            name="coupeurs"
            text={data.coupeurs}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Tiquitage"
            type="number"
            name="tiquitage"
            text={data.tiquitage}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Vesline"
            type="number"
            name="vesline"
            text={data.vesline}
            handleChange={onChange}
          />
          <div className="mb-4">
            <label className="block font-semibold">Quenta</label>
            <div className="mt-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="cointa"
                  value={true}
                  checked={data.cointa === true}
                  onChange={(e) =>
                    onChange("cointa", e.target.value === "true")
                  }
                />
                Oui
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="cointa"
                  value={false}
                  checked={data.cointa === false}
                  onChange={(e) => onChange("cointa", e.target.value === 0)}
                />
                Non
              </label>
            </div>
          </div>

          {data.cointa && (
            <Input
              container="mb-4"
              label="Prix par pièce"
              type="number"
              name="price_by_part"
              text={data.price_by_part}
              handleChange={onChange}
            />
          )}

          <Button classes="bg-blue-500 my-5 mb-8">
            {loading ? "Enregistrement ..." : "Enregistrer Effectif Indirect"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EffectiveIndirect;
