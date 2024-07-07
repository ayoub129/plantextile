import React, { useEffect, useState } from 'react';
import FullCalendar from './FullCalendar';
import api from '../../api/axios';

const Control = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className='ml-[19%] pt-[6rem]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Control Final</h2>
        <div className='ml-7 mb-4 pr-6'>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
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
        </div>
      </div>
      {selectedModel && (
        <FullCalendar url={'/coupe-productions'} selectedModel={selectedModel} />
      )}
    </div>
  );
}

export default Control;
