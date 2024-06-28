import React, { useState } from 'react'
import Card from './Card'

const CardsData = () => {
  const [selectedOption, setSelectedOption] = useState('Dashboard');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='bg-slate-200 ml-0 md:ml-[16.67%]'>
      <div className='ml-7 pt-[6rem]'>
        <div className='flex justify-between'>
          <div>
            <label className='block font-semibold	mb-2'>Select a Model :</label>
            <select 
              value={selectedOption}
              onChange={handleSelectChange}
              className='text-[#4E4A4A] font-bold bg-white border border-gray-300 rounded-md p-2 scroll'
              >
              <option value="31-45ad">31-45ad</option>
              <option value="32-45ad">32-45ad</option>
              <option value="33-45ad">33-45ad</option>
              <option value="34-45ad">34-45ad</option>
              <option value="35-45ad">35-45ad</option>
              <option value="36-45ad">36-45ad</option>
              <option value="37-45ad">37-45ad</option>
              <option value="38-45ad">38-45ad</option>
            </select>
          </div>
          <div className='mr-7'>
            <div><strong>Cours de change: 10,90</strong></div>
            <div><strong>Prix du modele: 3,40</strong></div>
          </div>
        </div>
      </div>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-7 mt-5'>
        <Card lowBetter={true} newData={7} oldData={8} title="Chains" icon="link" />
        <Card price={"DH"} lowBetter={true} newData={1200} oldData={1650} title="Transport" icon="van-shuttle" />
        <Card newData={200} oldData={250} title="conge" icon="user-group" />
        <Card lowBetter={true} newData={25000} oldData={35000} title="fils et plastique" icon="dollar-sign" />
      </div>
    </div>
  )
}

export default CardsData
