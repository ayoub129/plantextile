import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Input from '../ui/Input';

const ProductionChain = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedChain, setSelectedChain] = useState('');

  const [value, setValue] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    const fetchChains = async () => {
      try {
        const response = await api.get('/chains');
        setChains(response.data);
      } catch (error) {
        console.error('Error fetching chains:', error);
      }
    };

    fetchModels();
    fetchChains();
  }, []);

  useEffect(() => {
    const fetchCoupeProduction = async () => {
      if (selectedModel) {
        try {
          const response = await api.get(`/chain_production/${selectedModel}/${selectedChain}`);
          setValue(response.data.value);
        } catch (error) {
          console.error('Error fetching CoupeProduction data:', error);
        }
      }
    };

    fetchCoupeProduction();
  }, [selectedModel]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  }

  const onChange = (name, value) => {
    setValue(parseInt(value, 10));
  };

  const handleChange = async (direction) => {
    if (direction === 'next') {
      const newValue = value + 1;
      setValue(newValue);

      setIsButtonDisabled(true);

      try {
        await api.post(`/chain_production/${selectedModel}/${selectedChain}`, { value: newValue });
      } catch (error) {
        console.error('Error updating CoupeProduction data:', error);
      } finally {
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 3000);
      }
    }
  };

  return (
    <div className='ml-[19%] pt-[6rem]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Production Chain</h2>
        <div className='ml-7 mb-4 pr-6 flex items-center w-[325px] justify-between'>
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="">Select model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedChain}
            onChange={handleChainChange}
          >
            <option value="">Select Chain</option>
            {chains.map((chain , index) => (
              <option key={index} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModel && selectedChain && 
        <div className='w-full pr-6'>
          {models.map((model) => (
            <div key={model.id} className='flex items-center justify-between'>
              <h3 className='font-semibold'>{model.category}</h3>
              <h3 className='font-semibold'>{model.client}</h3>
            </div>
          ))}
        </div>
      }
      {selectedModel && selectedChain &&   
        <div className="flex justify-center mx-auto mt-[2rem] items-center mb-4 shadow-md w-fit p-1 rounded border">
          <Input handleChange={onChange} name={'coupe'} placeholder='Total Coupe' text={value} />
          <button
            className='font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded'
            onClick={() => handleChange('next')}
            disabled={isButtonDisabled}
          >
            +
          </button>
        </div>
      }
    </div>
  );
}

export default ProductionChain;