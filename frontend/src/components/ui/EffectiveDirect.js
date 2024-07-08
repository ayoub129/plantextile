// import React component, API and Toast
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// custom components
import Input from '../ui/Input';
import Button from '../ui/Button';

const EffectiveDirect = ({url = "effective_standard"}) => {
  // data state change
  const [data, setData] = useState({
    chain: '',
    model: '',
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
    transp_fin: '',
    start_date: '',
    end_date: '',
    cointa: '',
    price_by_part: ''
  });

  // chain and model state change
  const [chains, setChains] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  // effective standard id state change
  const [effectiveStandardId, setEffectiveStandardId] = useState(null);

  useEffect(() => {
    // get models and chains
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        toast.error('Error fetching models.');
      }
    };

    const fetchChains = async () => {
      try {
        const response = await api.get('/chains');
        setChains(response.data);
      } catch (error) {
        toast.error('Error fetching chains.');
      }
    };

    fetchModels();
    fetchChains();
  }, []);

  // handle changes to the input
  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  // handle date changes
  const handleDateChange = (date, name) => {
    setData({
      ...data,
      [name]: date
    });
  };

  const handleModelChange = async (e) => {
    const model = e.target.value;
    setData((prevData) => ({
      ...prevData,
      model: model
    }));
  };

  useEffect(() => {
    console.log(data)
    const checkExisted = async () => {
      try {
        // get the effective by model
        const response = await api.get(`/${url}/${data.model}`);
        if (response.data) {
          const effectiveStandardData = response.data;
          const effectifDirects = effectiveStandardData.effectif_directs[0] || {};
  
          setData({
            chain: effectiveStandardData.chain || '',
            modele: effectiveStandardData.model,
            machinistes: effectifDirects.machinistes || '',
            machinistes_stagiaires: effectifDirects.machinistes_stagiaires || '',
            repassage_preparation: effectifDirects.repassage_preparation || '',
            trassage: effectifDirects.trassage || '',
            transport: effectifDirects.transport || '',
            chef: effectifDirects.chef || '',
            machines_speciales: effectifDirects.machines_speciales || '',
            trassage_special: effectifDirects.trassage_special || '',
            controle_table: effectifDirects.controle_table || '',
            controle_final: effectifDirects.controle_final || '',
            machinistes_retouche: effectifDirects.machinistes_retouche || '',
            repassage_final: effectifDirects.repassage_final || '',
            finition: effectifDirects.finition || '',
            transp_fin: effectifDirects.transp_fin || '',
            start_date: effectiveStandardData.start_date || '',
            end_date: effectiveStandardData.end_date || '',
            cointa: effectiveStandardData.cointa || '',
            price_by_part: effectiveStandardData.price_by_part || ''
          });
  
          setEffectiveStandardId(effectiveStandardData.id);
        } else {
          setEffectiveStandardId(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setEffectiveStandardId(null);
      }
    }

    checkExisted()
  }, [data.model]);


  // handle submit
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formattedData = {
      start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : '',
      end_date: data.end_date ? data.end_date.toISOString().split('T')[0] : '',
      cointa: data.cointa,
      price_by_part: data.price_by_part,
      chain: data.chain,
      model: data.model,
      effectif_directs: [{
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
        transp_fin: data.transp_fin
      }],
      effectif_indirects: [] // Add the necessary indirects here if any
    };

    console.log(formattedData)

    try {
      if (effectiveStandardId) {
        await api.post(`/${url}/${effectiveStandardId}`, formattedData);
        toast.success('Data updated successfully.');
      } else {
        await api.post(`/${url}`, formattedData);
        toast.success('Data saved successfully.');
      }
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
        transp_fin: '',
        start_date: '',
        end_date: '',
        cointa: '',
        price_by_part: ''
      });
      setEffectiveStandardId(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // handle deletion of an effective standard
      await api.delete(`/${url}/${effectiveStandardId}`);
      toast.success('Data deleted successfully.');
      setData({
        chain: '',
        model: '',
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
        transp_fin: '',
        start_date: '',
        end_date: '',
        cointa: '',
        price_by_part: ''
      });
      setEffectiveStandardId(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting data.' , error);
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
            onChange={(date) => handleDateChange(date, 'start_date')}
            dateFormat="yyyy-MM-dd"
            className="outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">End Date</label>
          <DatePicker
            selected={data.end_date ? new Date(data.end_date) : null}
            onChange={(date) => handleDateChange(date, 'end_date')}
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
                onChange={(e) => onChange('cointa', e.target.value === 'true')}
              />
              Yes
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="cointa"
                value={false}
                checked={data.cointa === false}
                onChange={(e) => onChange('cointa', e.target.value === 0)}
              />
              No
            </label>
          </div>
        </div>

        {data.cointa && (
          <Input
            container="mb-4"
            label="Price by Part"
            type='number'
            name="price_by_part"
            text={data.price_by_part}
            handleChange={onChange}
          />
        )}

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

        <Button classes="bg-blue-500 my-5 mb-8">{loading ? "Saving ..." : "Save Effective Direct"}</Button>

        {effectiveStandardId && (
          <Button classes="bg-red-500 my-5 mb-8" onClick={handleDelete}>Delete Effective Direct</Button>
        )}
      </form>
    </div>
  );
}

export default EffectiveDirect;
