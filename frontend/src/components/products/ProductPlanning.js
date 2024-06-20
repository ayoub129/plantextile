import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Input from '../ui/Input';
import Button from '../ui/Button';

function ProductPlanning() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [data, setData] = useState({
    Modele: '',
    chain: '',
    Date: '',
    Quantité: '',
    Quenta: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsModalOpen(false);
    setFormSubmitted(true);
    setEvents([...events, { title: data.Modele, date: selectedDate }]);
  };

  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const handleEventChange = (e, key) => {
    setEvents({
      ...events,
      [key]: e.target.value
    });
  };

  return (
    <div className='ml-[16.66%] mr-5 pt-[6rem]'>
      <form className='ml-7' onSubmit={handleSubmit}>
        <Input
          container="mb-4"
          label="Modele"
          name="Modele"
          value={data.Modele}
          handleChange={handleChange}
        />

        <div className="mb-4">
          <label className="block font-semibold">Chain</label>
          <select
            className="block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={data.chain}
            onChange={(e) => handleChange('chain', e.target.value)}
          >
            <option value="">Select Chain</option>
            <option value="Chain1">Chain1</option>
            <option value="Chain2">Chain2</option>
            <option value="Chain3">Chain3</option>
          </select>
        </div>
        <input
          className={`block w-full mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded`}
          type={'text'}
          placeholder={'Quantité'}
          value={'Quantité'}
          onChange={(e) => handleChange('Quantité', e.target.value)}
        />

        <Input
          container="mb-4"
          label="Quantité"
          name="Quantité"
          value={data.Quantité}
          handleChange={handleChange}
        />

        <div className="mb-4">
          <label className="block font-semibold">Quenta</label>
          <div className="mt-4">
            <label className="mr-4">
              <input
                type="radio"
                name="Quenta"
                value="Option1"
                checked={data.Quenta === 'Option1'}
                onChange={(e) => handleChange('Quenta', e.target.value)}
              />
              Option1
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="Quenta"
                value="Option2"
                checked={data.Quenta === 'Option2'}
                onChange={(e) => handleChange('Quenta', e.target.value)}
              />
              Option2
            </label>
          </div>
        </div>

        <Button classes="bg-blue-500 my-5 mb-8">Create Planning</Button>
      </form>

      {formSubmitted && (
        <div className='ml-7'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            dateClick={handleDateClick}
            events={events}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <Input
              container="mb-4"
              label="title"
              name="title"
              value={events.title}
              handleChange={(e) => handleEventChange(e, 'title')}
            />
            <Button classes="bg-blue-500 my-5 mb-8">Create Planning</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPlanning;
