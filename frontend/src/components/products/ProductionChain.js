import React, { useEffect, useState } from 'react';
import FullCalendar from './FullCalendar';
import api from '../../api/axios';

const ProductionChain = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedChain, setSelectedChain] = useState('');

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

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  return (
    <div className='ml-[19%] pt-[6rem]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Production</h2>
        <div className='flex ml-7 mb-4 pr-6'>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mr-4"
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
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedChain}
            onChange={handleChainChange}
          >
            <option value="">Select chain</option>
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModel && selectedChain && (
        <FullCalendar url={'/productions'} selectedModel={selectedModel} selectedChain={selectedChain} />
      )}
    </div>
  );
}

export default ProductionChain;