import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProductionChain = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedModelDetails, setSelectedModelDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isAddDisabled, setIsAddDisabled] = useState(false);

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
    const selectedModelId = e.target.value;
    setSelectedModel(selectedModelId);
    const modelDetails = models.find((model) => model.id === selectedModelId);
    setSelectedModelDetails(modelDetails);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const handleAddToCart = () => {
    if (selectedModelDetails && selectedChain) {
      const item = {
        ...selectedModelDetails,
        chain: chains.find((chain) => chain.id === selectedChain).name,
      };
      setCartItems([...cartItems, item]);
      setIsAddDisabled(true);
      setTimeout(() => setIsAddDisabled(false), 3000); // Disable button for 3 seconds
    }
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
      {selectedModelDetails && (
        <div className='mt-4 p-4 border rounded shadow'>
          <h3 className='text-lg font-semibold'>{selectedModelDetails.modele}</h3>
          <p>Category: {selectedModelDetails.category}</p>
          <img src={selectedModelDetails.image} alt={selectedModelDetails.modele} className='mt-2' />
          <button
            className='mt-4 p-2 bg-blue-500 text-white rounded disabled:opacity-50'
            onClick={handleAddToCart}
            disabled={isAddDisabled}
          >
            Add to Cart
          </button>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>Cart</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className='mt-2 p-2 border rounded shadow'>
                <p><strong>Model:</strong> {item.modele}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Chain:</strong> {item.chain}</p>
                <img src={item.image} alt={item.modele} className='mt-2' />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductionChain;
