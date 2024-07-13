import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../ui/Input";
import Button from "../ui/Button";

const EffectiveIndirect = ({ url = "effective_standard" }) => {
  const [data, setData] = useState({
    chain: "",
    model: "",
    start_date: "",
    end_date: "",
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
        toast.error("Error fetching models.");
      }
    };

    const fetchChains = async () => {
      try {
        const response = await api.get("/chains");
        setChains(response.data);
      } catch (error) {
        toast.error("Error fetching chains.");
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
    setData({
      ...data,
      [name]: date,
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
      try {
        const response = await api.get(`/${url}/${data.model}`);
        if (response.data) {
          const effectiveStandardData = response.data;
          const effectiveIndirectData =
            effectiveStandardData.effectif_indirects[0] || null;
          const coupes = effectiveIndirectData.coupes[0] || {};
          if (effectiveIndirectData != null) {
            setData({
              chain: effectiveStandardData.chain || "",
              model: effectiveStandardData.model,
              start_date: effectiveStandardData.start_date || "",
              end_date: effectiveStandardData.end_date || "",
              cointa: effectiveStandardData.cointa || "",
              price_by_part: effectiveStandardData.price_by_part || "",
              mag_four: effectiveIndirectData.mag_four || "",
              mag_fin: effectiveIndirectData.mag_fin || "",
              machines_sp_manuelle:
                effectiveIndirectData.machines_sp_manuelle || "",
              cont_fin: effectiveIndirectData.cont_fin || "",
              mach_retouche: effectiveIndirectData.mach_retouche || "",
              repassage: effectiveIndirectData.repassage || "",
              gabaret: effectiveIndirectData.gabaret || "",
              preparation_stagieres:
                effectiveIndirectData.preparation_stagieres || "",
              preparation: effectiveIndirectData.preparation || "",
              preparation_elastique:
                effectiveIndirectData.preparation_elastique || "",
              matlasseurs: coupes.matlasseurs || "",
              coupeurs: coupes.coupeurs || "",
              tiquitage: coupes.tiquitage || "",
              vesline: coupes.vesline || "",
            });

            setEffectiveStandardId(effectiveStandardData.id);
          }
        } else {
          setEffectiveStandardId(null);
        }
      } catch (error) {
        console.error("Error:", error);
        setEffectiveStandardId(null);
      }
    };

    if (data.model) {
      checkExisted();
    }
  }, [data.model]);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formattedData = {
      chain: data.chain,
      model: data.model,
      start_date: data.start_date
        ? data.start_date.toISOString().split("T")[0]
        : "",
      end_date: data.end_date ? data.end_date.toISOString().split("T")[0] : "",
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

    console.log(formattedData);

    try {
      if (effectiveStandardId) {
        await api.post(`/${url}/${effectiveStandardId}`, formattedData);
        toast.success("Data updated successfully.");
      } else {
        await api.post(`/${url}`, formattedData);
        toast.success("Data saved successfully.");
      }
      setData({
        chain: "",
        model: "",
        start_date: "",
        end_date: "",
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
      console.error("Error:", error);
      toast.error("Error saving data.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/${url}/${effectiveStandardId}`);
      toast.success("Data deleted successfully.");
      setData({
        chain: "",
        model: "",
        start_date: "",
        end_date: "",
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
      console.error("Error:", error);
      toast.error("Error deleting data.", error);
    }
  };

  return (
    <div className="ml-[16.66%] mr-5 pt-[6rem]">
      <ToastContainer />
      <form className="ml-7" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Chain</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => onChange("chain", e.target.value)}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Model</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.model}
            onChange={handleModelChange}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Start Date</label>
          <DatePicker
            selected={data.start_date ? new Date(data.start_date) : null}
            onChange={(date) => handleDateChange(date, "start_date")}
            dateFormat="yyyy-MM-dd"
            className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">End Date</label>
          <DatePicker
            selected={data.end_date ? new Date(data.end_date) : null}
            onChange={(date) => handleDateChange(date, "end_date")}
            dateFormat="yyyy-MM-dd"
            className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Quenta</label>
          <div className="mt-4">
            <label className="mr-4">
              <input
                type="radio"
                name="cointa"
                value={true}
                checked={data.cointa === true}
                onChange={(e) => onChange("cointa", e.target.value === "true")}
              />
              Yes
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="cointa"
                value={false}
                checked={data.cointa === false}
                onChange={(e) => onChange("cointa", e.target.value === 0)}
              />
              No
            </label>
          </div>
        </div>

        {data.cointa && (
          <Input
            container="mb-4"
            label="Price by Part"
            type="number"
            name="price_by_part"
            text={data.price_by_part}
            handleChange={onChange}
          />
        )}

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
          label="Preparation Stagieres"
          type="number"
          name="preparation_stagieres"
          text={data.preparation_stagieres}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Preparation"
          type="number"
          name="preparation"
          text={data.preparation}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Preparation Elastique"
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

        <Button classes="bg-blue-500 my-5 mb-8">
          {loading ? "Saving ..." : "Save Effective Indirect"}
        </Button>

        {effectiveStandardId && (
          <Button classes="bg-red-500 my-5 mb-8" onClick={handleDelete}>
            Delete Effective Indirect
          </Button>
        )}
      </form>
    </div>
  );
};

export default EffectiveIndirect;
