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
  const [events, setEvents] = useState({
    title: '',
    date: ''
  });
  const [data, setData] = useState({
    Modele: '',
    chain: '',
    Date: '',
    Quantité: '',
    Quenta: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);  // State to track if the form has been submitted

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsModalOpen(false);
    setFormSubmitted(true);  // Set to true when the form is submitted
  };

  const handleChange = (e, key) => {
    setData({
      ...data,
      [key]: e.target.value
    });
  };

  const handlEventChange = (e, key) => {
    setEvents({
      ...events,
      [key]: e.target.value
    })
  }

  return (
    <div className='ml-[16.66%] my-10 mr-5 mt-[6rem]'>
      <form className='ml-7' onSubmit={handleSubmit}>
          <Input container="mb-4" label="Modele" value={data.Modele} handleChange={(e) => handleChange(e, 'Modele')} />
          <Input container="mb-4" label="Chain" value={data.chain} handleChange={(e) => handleChange(e, 'chain')} />
          <Input container="mb-4" label="Quantité" value={data.Quantité} handleChange={(e) => handleChange(e, 'Quantité')} />
          <Input container="mb-4" label="Quenta" value={data.Quenta} handleChange={(e) => handleChange(e, 'Quenta')} />
          <Button classes="bg-blue-500 my-5 mb-8">Create Planning</Button>
      </form>
      {formSubmitted && (  // Only display the calendar if the form has been submitted at least once
        <div className='ml-7'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            dateClick={handleDateClick}
            events={events}
          />
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <Input container="mb-4" label="title" value={events.title} handleChange={(e) => handlEventChange(e, 'title')} />
            <Button classes="bg-blue-500 my-5 mb-8">Create Planning</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPlanning;