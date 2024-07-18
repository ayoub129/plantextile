import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";

const hours = Array.from({ length: 15 }, (_, i) => {
  const hour = 7 + i;
  const nextHour = hour + 1;
  return `${hour}:30 - ${nextHour}:30`;
});

function FullCalendar({ url, planningData }) {
  const [events, setEvents] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);
  const [datesRange, setDatesRange] = useState([]);
  const [totalModelsFinished, setTotalModelsFinished] = useState(0);

  useEffect(() => {
    if (planningData.start_date && planningData.end_date) {
      generateDatesRange(
        new Date(planningData.start_date),
        new Date(planningData.end_date)
      );
    }
    fetchEvents();
  }, [planningData.start_date, planningData.end_date]);

  const generateDatesRange = (startDate, endDate) => {
    const range = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      range.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    setDatesRange(range);
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get(`${url}/${planningData.id}`);
      const eventsData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      const fetchedEvents = eventsData.reduce((acc, event) => {
        acc[`${event.date}-${event.hour}`] = event.models_finished;
        return acc;
      }, {});
      setEvents(fetchedEvents);

      // Calculate total models finished
      const total = eventsData.reduce(
        (sum, event) => sum + event.models_finished,
        0
      );
      setTotalModelsFinished(total);
    } catch (error) {
      toast.error("Erreur : " + error);
    }
  };

  const handleDoubleClick = (date, hour) => {
    setEditingEvent({ date, hour });
  };

  const handleEventChange = (e) => {
    const { date, hour } = editingEvent;
    const newEvents = { ...events, [`${date}-${hour}`]: e.target.value };
    setEvents(newEvents);
  };

  const handleEventBlur = async () => {
    const { date, hour } = editingEvent;
    const eventValue = parseInt(events[`${date}-${hour}`], 10) || 0;

    try {
      const existingEventResponse = await api.post(`${url}/search`, {
        product_plan_id: planningData.id,
        date: date,
        hour: hour,
      });

      if (existingEventResponse.data.length > 0) {
        if (eventValue) {
          await api.post(`${url}/${existingEventResponse.data[0].id}`, {
            product_plan_id: planningData.id,
            date: date,
            hour: hour,
            models_finished: eventValue,
          });
          const newTotal =
            totalModelsFinished -
            existingEventResponse.data[0].models_finished +
            eventValue;
          setTotalModelsFinished(newTotal);

          if (newTotal > planningData.qte) {
            toast.error(
              "La quantité ne peut pas être supérieure à Quantité Société de modèle."
            );
            setEvents({ ...events, [`${date}-${hour}`]: 0 }); // Reset to 0 or previous value
            setEditingEvent(null);
            return;
          }
        } else {
          await api.delete(`${url}/${existingEventResponse.data[0].id}`);
          const newEvents = { ...events };
          delete newEvents[`${date}-${hour}`];
          const newTotal =
            totalModelsFinished - existingEventResponse.data[0].models_finished;
          setTotalModelsFinished(newTotal);

          if (newTotal > planningData.qte) {
            toast.error(
              "La quantité ne peut pas être supérieure à Quantité Société de modèle."
            );
            setEvents({ ...events, [`${date}-${hour}`]: 0 }); // Reset to 0 or previous value
            setEditingEvent(null);
            return;
          }

          setEvents(newEvents);
        }
      } else if (eventValue) {
        await api.post(url, {
          product_plan_id: planningData.id,
          date: date,
          hour: hour,
          models_finished: eventValue,
        });
        const newTotal = totalModelsFinished + eventValue;
        setTotalModelsFinished(newTotal);

        if (newTotal > planningData.qte) {
          toast.error(
            "La quantité ne peut pas être supérieure à Quantité Société de modèle."
          );
          setEvents({ ...events, [`${date}-${hour}`]: 0 }); // Reset to 0 or previous value
          setEditingEvent(null);
          return;
        }
      }

      // Update total models finished
    } catch (error) {
      toast.error(
        "La quantité ne peut pas être supérieure à Quantité Société de modèle."
      );
    }

    setEditingEvent(null);
  };

  return (
    <div className="pt-5 pr-1">
      <ToastContainer />
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold text-xl mb-[0.5rem]">
          Date de lancement: {planningData.start_date}
        </div>
        <div className="font-semibold text-xl mb-[0.5rem]">
          Quantity Société: {planningData.qte}
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold text-xl mb-[3rem]">
          Cumul: {totalModelsFinished}
        </div>
        <div className="font-semibold text-xl mb-[3rem]">
          Quantity restante: {planningData.qte - totalModelsFinished}
        </div>
      </div>
      <div
        className="overflow-auto relative"
        style={{ maxHeight: "550px", maxWidth: "1400px" }}
      >
        <div className="grid grid-cols-16 gap-1 z-10">
          <div className="col-span-1"></div> {/* Empty top-left corner */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="text-center font-bold border sticky top-0 bg-white"
            >
              {hour}
            </div>
          ))}
          {datesRange.map((date) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const dayOfWeek = format(date, "EEEE", { locale: fr }); // Format day of week in French
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Check if Saturday or Sunday

            return (
              <React.Fragment key={formattedDate}>
                <div
                  className={`text-right w-[150px] font-bold border items-center justify-center flex pr-2 sticky left-0 z-20 ${
                    isWeekend ? "bg-red-100" : "bg-white"
                  }`}
                  style={{ height: "100px" }}
                >
                  {dayOfWeek} {date.getDate()}
                </div>
                {hours.map((hour) => (
                  <div
                    key={`${formattedDate}-${hour}`}
                    className={`border p-2 relative cursor-pointer h-[100px] w-[120px] z-0 border-r-2 border-b-2 ${
                      isWeekend ? "bg-red-100" : "bg-white"
                    }`}
                    onDoubleClick={() => handleDoubleClick(formattedDate, hour)}
                  >
                    {editingEvent &&
                    editingEvent.date === formattedDate &&
                    editingEvent.hour === hour ? (
                      <input
                        className="w-full h-full"
                        type="number"
                        value={events[`${formattedDate}-${hour}`] || ""}
                        onChange={handleEventChange}
                        onBlur={handleEventBlur}
                      />
                    ) : (
                      events[`${formattedDate}-${hour}`] || ""
                    )}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FullCalendar;
