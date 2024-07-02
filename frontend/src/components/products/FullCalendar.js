import React, { useState } from 'react';
import { format, addDays, subDays, startOfWeek, isValid } from 'date-fns';

const FullCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const nextWeek = () => {
    const next = addDays(currentWeek, 7);
    if (isValid(next)) {
      setCurrentWeek(next);
    }
  };

  const previousWeek = () => {
    const previous = subDays(currentWeek, 7);
    if (isValid(previous)) {
      setCurrentWeek(previous);
    }
  };

  const renderDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      if (isValid(day)) {
        days.push(day);
      }
    }
    return days.map(day => (
      <div key={day.toISOString()} className="border p-2 text-center">
        {format(day, 'MM/dd/yyyy')}
      </div>
    ));
  };

  const renderHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i}:00`);
    }
    return hours.map(hour => (
      <div key={hour} className="border p-2 text-center">
        {hour}
      </div>
    ));
  };

  const renderCells = (dayIndex) => {
    const cells = [];
    for (let j = 0; j < 24; j++) {
      cells.push(
        <div key={`${dayIndex}-${j}`} className="border p-2">
          <input type="text" className="w-full h-full text-center" />
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button onClick={previousWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Previous Week
        </button>
        <button onClick={nextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-25 gap-1">
        <div className="col-span-1 row-span-1"></div>
        {renderHours()}
        {renderDays().map((day, index) => {
          console.log(day);
          return (
            <React.Fragment key={day.toISOString()}>
              <div className="border p-2 text-center">{format(day.toISOString(), 'MM/dd/yyyy')}</div>
              {renderCells(index)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FullCalendar;
