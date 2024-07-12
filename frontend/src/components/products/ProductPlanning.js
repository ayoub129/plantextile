// import React components, API and Toast
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
// import custom components
import FullCalendar from './FullCalendar';
import Input from '../ui/Input';
import Button from '../ui/Button';

function ProductPlanning() {
  // handle planing data
  const [data, setData] = useState({
    model_id: '',
    chain: '',
    Quenta: '',
    start_date: null,
    end_date: null,
    qte: '',
    consummation_standard_fil: '',
    consummation_standard_plastique: ''
  });

  // get models and chain from the backend to choose from them
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  // get the planning data as well as the loading and the error state
  const [planningData, setPlanningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // handle modal showing and isEdit state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // fetch models and chains
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

  useEffect(() => {
    // get planning base on the model ID
    const fetchPlanning = async () => {
      if (data.model_id) {
        setLoading(true);
        try {
          const response = await api.get(`/product_plans_model/${data.model_id}`);
          setPlanningData(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setPlanningData(null);
          } else {
            toast.error('Error fetching planning data.');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPlanning();
  }, [data.model_id]);

  // handle creating a new plan
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : null,
    };

    try {
      await api.post('/product_plans', formattedData);
      resetForm();
      toast.success('Product plan created successfully.');
    } catch (error) {
      toast.error('Error saving product.');
      setError('Error saving plan.');
    }
  };

  // handle updating plans
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const formattedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : null,
    };

    try {
      await api.post(`/product_plans/${data.id}`, formattedData);
      resetForm();
      setIsEditing(false);
      toast.success('Product plan updated successfully.');
    } catch (error) {
      toast.error('Error updating product.');
      setError('Error updating plan.');
    }
  };

  // reset form to free input values
  const resetForm = () => {
    setData({
      model_id: '',
      chain: '',
      Quenta: '',
      start_date: null,
      end_date: null,
      qte: '',
      consummation_standard_fil: '',
      consummation_standard_plastique: ''
    });
    setPlanningData(null);
  };

  // handle input change
  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  // handle date input change
  const handleDateChange = (date, name) => {
    setData({
      ...data,
      [name]: date
    });
  };

  // get the single data to edit
  const handleEdit = async () => {
    if (planningData) {
      try {
        const response = await api.get(`/product_plans_single/${planningData.id}`);
        const fetchedData = response.data;

        setData({
          ...fetchedData,
          start_date: fetchedData.start_date ? new Date(fetchedData.start_date) : null,
          end_date: fetchedData.end_date ? new Date(fetchedData.end_date) : null
        });

        setPlanningData(null)
        
        setIsEditing(true);
      } catch (error) {
        toast.error('Error fetching planning data.');
      }
    }
  };

  // show modal to delete
  const handleDelete = async () => {
    if (planningData) {
      setShowDeleteModal(true);
    }
  };

  // confirm delete
  const confirmDelete = async () => {
    if (planningData) {
      try {
        await api.delete(`/product_plans/${planningData.id}`);
        resetForm();
        toast.success('Plan deleted successfully.');
      } catch (error) {
        toast.error('Error deleting plan.');
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  // cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className='md:ml-[16.66%] mr-6 pt-[6rem]'>
      <div className='flex items-center justify-between'>
        <h1 className='ml-7 mb-5 text-2xl'>{isEditing ? 'Update Planning' : 'Create Planning'}</h1>
        <div className='flex items-center w-[200px] justify-between'>
          <Button classes={'bg-yellow-400'} handlePress={handleEdit}>Update</Button>
          <Button classes={'bg-red-400'} handlePress={handleDelete}>Delete Plan</Button>
        </div>
      </div>
      <ToastContainer />
      <div className='ml-7 mb-4'>
        <label className="block font-semibold">model_id</label>
        <select
          className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
          value={data.model_id}
          onChange={(e) => onChange('model_id', e.target.value)}
        >
          <option value="">Select model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.modele}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className='text-center font-semibold'>Loading...</p>}

      {!loading && !planningData && (
        <form className='ml-7' onSubmit={isEditing ? handleUpdateSubmit : handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Chain</label>
            <select
              className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
              value={data.chain}
              onChange={(e) => onChange('chain', e.target.value)}
            >
              <option value="">Select Chain</option>
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
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

          <Input
            container="mb-4"
            label="Qte"
            type='number'
            name="qte"
            text={data.qte}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Consummation Standard Fil"
            type='number'
            name="consummation_standard_fil"
            text={data.consummation_standard_fil}
            handleChange={onChange}
          />

          <Input
            container="mb-4"
            label="Consummation Standard Plastique"
            type='number'
            name="consummation_standard_plastique"
            text={data.consummation_standard_plastique}
            handleChange={onChange}
          />

          <div className="mb-4">
            <label className="block font-semibold">Quenta</label>
            <div className="mt-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="Quenta"
                  value="Yes"
                  checked={data.Quenta === 'Yes'}
                  onChange={(e) => onChange('Quenta', e.target.value)}
                />
                Yes
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="Quenta"
                  value="No"
                  checked={data.Quenta === 'No'}
                  onChange={(e) => onChange('Quenta', e.target.value)}
                />
                No
              </label>
            </div>
          </div>

          <Button classes="bg-blue-500 my-5 mb-8">{isEditing ? 'Update Planning' : 'Create Planning'}</Button>
        </form>
      )}

      {planningData && !loading && !error && (
        <div className='ml-7'>
          <FullCalendar url={'/product_plans_hours'} planningData={planningData} />
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 z-50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-xl mb-4">Are you sure you want to delete this plan?</h2>
            <div className="flex justify-end">
              <Button classes="bg-red-500 w-[70px]" handlePress={confirmDelete}>Yes</Button>
              <Button classes="bg-gray-300 ml-3" handlePress={cancelDelete}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPlanning;
