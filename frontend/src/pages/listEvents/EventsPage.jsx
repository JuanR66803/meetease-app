// frontend/src/pages/events/EventPages.jsx
import React, { useEffect, useState } from 'react';
import './EventsPage.css';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Hacemos la solicitud al backend para obtener los eventos
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); 
        const data = await response.json();
        setEvents(data); // Guardamos los eventos en el estado
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  <h1>probando pag </h1>

  return (  
    <div>
      <h1>Listado de Eventos</h1>
      {events.length === 0 ? (
        <p>No hay eventos disponibles</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <p>{event.date}</p> {/* campos del modelo */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
