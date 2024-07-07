// import the react components and api
import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { toast, ToastContainer } from 'react-toastify';

// calculate the hours at the top to start from 7:30 - 8:30 until 21:30 - 22:30
const hours = Array.from({ length: 15 }, (_, i) => {
  const hour = 7 + i;
  const nextHour = hour + 1;
  return `${hour}:30 - ${nextHour}:30`;
});

// days and month names
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function FullCalendar({ url,  planningData }) {
  // the events or basically the plan base on hours
  const [events, setEvents] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);
  // current month week and year
  const [currentMonth, setCurrentMonth] = useState(new Date(planningData.start_date).getMonth());
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date(planningData.start_date).getFullYear());

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentWeek]);

  const fetchEvents = async () => {
    try {
      // fetch events from the server based on the planing id
      const response = await api.get(`${url}/${planningData.id}`);
      console.log(response)
      const fetchedEvents = response.data.reduce((acc, event) => {
        acc[`${event.day}-${event.hour}`] = event.models_finished;
        return acc;
      }, {});
      setEvents(fetchedEvents);
    } catch (error) {
      toast.error('Error fetching events');
    }
  };

  // handle double click and set the day and hour to the current selected input
  const handleDoubleClick = (day, hour) => {
    setEditingEvent({ day, hour });
  };

  // handle input change and update the event in the events object
  const handleEventChange = (e) => {
    const { day, hour } = editingEvent;
    const newEvents = { ...events, [`${day}-${hour}`]: e.target.value };
    setEvents(newEvents);
  };

  const handleEventBlur = async () => {
    const { day, hour } = editingEvent;
    const eventValue = events[`${day}-${hour}`];

    try {
      const existingEventResponse = await api.post(`${url}/search`, {
        product_plan_id: planningData.id,
        day: day,
        hour: hour
      });

      if (existingEventResponse.data.length > 0) {
        if (eventValue) {
          await api.post(`${url}/${existingEventResponse.data[0].id}`, {
            product_plan_id: planningData.id,
            day:day,
            hour: hour,
            models_finished: eventValue,
            });
        } else {
          await api.delete(`${url}/${existingEventResponse.data[0].id}`);
          const newEvents = { ...events };
          delete newEvents[`${day}-${hour}`];
          setEvents(newEvents);
        }
      } else if (eventValue) {
        await api.post(url, {
          product_plan_id: planningData.id,
          day:day,
          hour: hour,
          models_finished: eventValue,
        });
      }
    } catch (error) {
      toast.error('Error fetching events');
    }

    setEditingEvent(null);
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek((prev) => {
      if (direction === 'next') {
        if (prev < weeksInMonth.length - 1) {
          return prev + 1;
        } else {
          handleMonthChange('next');
          return 0;
        }
      } else {
        if (prev > 0) {
          return prev - 1;
        } else {
          handleMonthChange('prev');
          return getWeeksInMonth(currentMonth - 1, currentYear).length - 1;
        }
      }
    });
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) => {
      if (direction === 'next') {
        if (prev === 11) {
          setCurrentYear(currentYear + 1);
          return 0;
        } else {
          return prev + 1;
        }
      } else {
        if (prev === 0) {
          setCurrentYear(currentYear - 1);
          return 11;
        } else {
          return prev - 1;
        }
      }
    });
    setCurrentWeek(0);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getWeeksInMonth = (month, year) => {
    const weeks = [];
    const daysInMonth = getDaysInMonth(month, year);
    const startDay = getStartDay(month, year);
    let dayCount = 1;

    for (let week = 0; week < 5; week++) {
      const weekDays = Array(7).fill(null);
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < startDay) {
          weekDays[day] = null;
        } else if (dayCount <= daysInMonth) {
          weekDays[day] = dayCount++;
        } else {
          weekDays[day] = null;
        }
      }
      weeks.push(weekDays);
    }

    return weeks;
  };

  const weeksInMonth = getWeeksInMonth(currentMonth, currentYear);

  return (
    <div className="pt-5 pr-1">
      <ToastContainer />
      <div className="mb-4">
        <div className="font-semibold">Date lancement: {planningData.start_date}</div>
        <div className="font-semibold">Quantity: {planningData.qte}</div>
      </div>
      <div className='flex items-center justify-between'>
        <div className="flex justify-between items-center mb-4 shadow-md w-fit p-1 rounded border">
          <button className='font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded' onClick={() => handleMonthChange('prev')}>&lt;</button>
          <span className='font-semibold mx-5 pt-1'>{`${monthNames[currentMonth]} ${currentYear}`}</span>
          <button className='font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded' onClick={() => handleMonthChange('next')}>&gt;</button>
        </div>
        <div className="flex items-center mb-4 shadow-md w-fit p-1 rounded border">
          <button className='font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded' onClick={() => handleWeekChange('prev')}>&lt;</button>
          <span className='font-semibold mx-5 pt-1'>{`Week ${currentWeek + 1}`}</span>
          <button className='font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded' onClick={() => handleWeekChange('next')}>&gt;</button>
        </div>
      </div>
      <div className="overflow-auto relative" style={{ maxHeight: '550px', maxWidth: '1400px' }}>
        <div className="grid grid-cols-16 gap-1 z-10">
          <div className="col-span-1"></div> {/* Empty top-left corner */}
          {hours.map((hour) => (
            <div key={hour} className="text-center font-bold border sticky top-0 bg-white">
              {hour}
            </div>
          ))}
          {daysOfWeek.map((day, dayIndex) => (
            <React.Fragment key={day}>
              <div className="text-right w-[150px] font-bold border items-center justify-center flex pr-2 sticky left-0 bg-white z-20" style={{ height: '100px' }}>
                {day} {weeksInMonth[currentWeek][dayIndex] !== null ? ": " + weeksInMonth[currentWeek][dayIndex] : ''}
              </div>
              {hours.map((hour) => (
                <div
                  key={`${day}-${hour}`}
                  className="border p-2 relative cursor-pointer h-[100px] w-[120px] z-0 border-r-2 border-b-2"
                  onDoubleClick={() => handleDoubleClick(day, hour)}
                >
                  {editingEvent && editingEvent.day === day && editingEvent.hour === hour ? (
                    <input
                      className="w-full h-full"
                      type="number"
                      value={events[`${day}-${hour}`] || ''}
                      onChange={handleEventChange}
                      onBlur={handleEventBlur}
                    />
                  ) : (
                    events[`${day}-${hour}`] || ''
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FullCalendar;
