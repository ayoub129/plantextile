import React from "react";
import Card from "./Card";

const CardsData = () => {
  return (
    <div className="bg-slate-200 ml-0 md:ml-[16.67%] pt-[6rem]">
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
