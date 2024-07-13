import React, { useEffect, useState } from "react";
import Card from "./Card";
import api from "../../api/axios";

const CardsData = ({ handleModal, models }) => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [model, setModel] = useState(null);
  const [productPlan, setProductPlan] = useState([]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedModelData = models.find(
      (model) => model.id === parseInt(event.target.value)
    );

    setModel(selectedModelData);
    handleModal(selectedModelData);
  };

  const under = model && model.qte_societe * parseInt(model.prixMOver);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const product = await api.get(
          `product_plans_model/${model && model != null && model.id}`
        );
        setProductPlan(product);
      } catch (error) {
        console.log(error);
      }
    };

    if (model != null) {
      fetchPlan();
    }

    console.log(productPlan);
  }, [model]);

  return (
    <div className="bg-slate-200 ml-0 md:ml-[16.67%]">
      <div className="ml-7 pt-[6rem]">
        <div className="flex justify-between">
          <div>
            <label className="block font-semibold	mb-2">Select a Model :</label>
            <select
              className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">Select model</option>
              {models &&
                models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.modele}
                  </option>
                ))}
            </select>
          </div>
          <div className="mr-7">
            <div>
              <strong>
                Cours de change de {model && model.devise} :{" "}
                {model && model.prixFacture / under}
              </strong>
            </div>
            <div>
              <strong>Prix du modele: {model && model.prixMOver}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-7 mt-5">
        <Card
          lowBetter={true}
          newData={7}
          oldData={8}
          title="Chains"
          icon="link"
        />
        <Card
          price={"DH"}
          lowBetter={true}
          newData={1200}
          oldData={1650}
          title="Transport"
          icon="van-shuttle"
        />
        <Card newData={200} oldData={250} title="conge" icon="user-group" />
        <Card
          lowBetter={true}
          newData={25000}
          oldData={35000}
          title="fils et plastique"
          icon="dollar-sign"
        />
      </div>
    </div>
  );
};

export default CardsData;
