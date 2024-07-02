import React, { useState, useEffect } from 'react';
import FullCalendar from './FullCalendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';

function ProductPlanning() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [planningData, setPlanningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    model_id: '',
    chain: '',
    Quantité: '',
    Quenta: '',
    start_date: null,
    end_date: null,
    qte: '',
    consummation_standard_fil: '',
    consummation_standard_plastique: ''
  });
  const [modalEventIndex, setModalEventIndex] = useState(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchPlanning = async () => {
      if (data.model_id) {
        setLoading(true);
        try {
          const response = await api.get(`/product_plans/${data.model_id}`);
          setPlanningData(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setPlanningData(null); 
          } else {
            console.error('Error fetching planning data:', error);
            toast.error('Error fetching planning data.');
          }
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchPlanning();
  }, [data.model_id]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formattedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : null,
    };
  
    try {
      await api.post('/product_plans', formattedData);
  
      if (modalEventIndex !== null) {
        const updatedEvents = [...events];
        updatedEvents[modalEventIndex] = { title: data.model_id, date: selectedDate };
        setEvents(updatedEvents);
      } else {
        setEvents([...events, { title: data.model_id, date: selectedDate }]);
      }
  
      setData({
        model_id: '',
        chain: '',
        Quantité: '',
        Quenta: '',
        start_date: null,
        end_date: null,
        qte: '',
        consummation_standard_fil: '',
        consummation_standard_plastique: ''
      });
      setSelectedDate(null);
      setModalEventIndex(null);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving product.');
      setError('Error saving plan.');
    }
  };
  
  const onChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const handleDateChange = (date, name) => {
    setData({
      ...data,
      [name]: date
    });
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
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
    {loading && <p>Loading...</p>}

      {!loading && !planningData &&       
      <form className='ml-7' onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Chain</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => onChange('chain', e.target.value)}
          >
            <option value="">Select Chain</option>
            <option value="Chain1">Chain1</option>
            <option value="Chain2">Chain2</option>
            <option value="Chain3">Chain3</option>
          </select>
        </div>

        <Input
          container="mb-4"
          label="Quantité"
          name="Quantité"
          type='number'
          text={data.Quantité}
          handleChange={onChange}
        />

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

        <Button classes="bg-blue-500 my-5 mb-8">Create Planning</Button>
      </form>
    }

      {!loading && planningData  &&  !error && (
        <div className='ml-7'>
          <FullCalendar />
        </div>
      )}
    </div>
  );
}

export default ProductPlanning;
