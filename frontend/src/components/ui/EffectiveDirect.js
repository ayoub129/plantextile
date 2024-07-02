import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EffectiveDirect = () => {
  const [data, setData] = useState({
    chain: '',
    modele: '',
    machinistes: '',
    machinistes_stagiaires: '',
    repassage_preparation: '',
    trassage: '',
    transport: '',
    chef: '',
    machines_speciales: '',
    trassage_special: '',
    controle_table: '',
    controle_final: '',
    machinistes_retouche: '',
    repassage_final: '',
    finition: '',
    transp_fin: ''
  });
  const [chains, setChains] = useState(['Chain1', 'Chain2', 'Chain3']);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Error fetching models.');
      }
    };

    fetchModels();
  }, []);

  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedData = {
      ...data,
      // Additional formatting if needed
    };

    try {
      await api.post('/effective_direct', formattedData);
      toast.success('Data saved successfully.');
      setData({
        chain: '',
        modele: '',
        machinistes: '',
        machinistes_stagiaires: '',
        repassage_preparation: '',
        trassage: '',
        transport: '',
        chef: '',
        machines_speciales: '',
        trassage_special: '',
        controle_table: '',
        controle_final: '',
        machinistes_retouche: '',
        repassage_final: '',
        finition: '',
        transp_fin: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data.');
    }
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
      <ToastContainer />
      <form className='ml-7' onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Chain</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => onChange('chain', e.target.value)}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Model</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.modele}
            onChange={(e) => onChange('modele', e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.modele}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>

        <Input
          container="mb-4"
          label="Machinistes"
          type='number'
          name="machinistes"
          text={data.machinistes}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machinistes Stagiaires"
          type='number'
          name="machinistes_stagiaires"
          text={data.machinistes_stagiaires}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage Preparation"
          type='number'
          name="repassage_preparation"
          text={data.repassage_preparation}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Trassage"
          type='number'
          name="trassage"
          text={data.trassage}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Transport"
          type='number'
          name="transport"
          text={data.transport}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Chef"
          type='number'
          name="chef"
          text={data.chef}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machines Speciales"
          type='number'
          name="machines_speciales"
          text={data.machines_speciales}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Trassage Special"
          type='number'
          name="trassage_special"
          text={data.trassage_special}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Controle Table"
          type='number'
          name="controle_table"
          text={data.controle_table}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Controle Final"
          type='number'
          name="controle_final"
          text={data.controle_final}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Machinistes Retouche"
          type='number'
          name="machinistes_retouche"
          text={data.machinistes_retouche}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Repassage Final"
          type='number'
          name="repassage_final"
          text={data.repassage_final}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Finition"
          type='number'
          name="finition"
          text={data.finition}
          handleChange={onChange}
        />

        <Input
          container="mb-4"
          label="Transport Fin"
          type='number'
          name="transp_fin"
          text={data.transp_fin}
          handleChange={onChange}
        />

        <Button classes="bg-blue-500 my-5 mb-8">Save Effective Direct</Button>
      </form>
    </div>
  );
}

export default EffectiveDirect;
