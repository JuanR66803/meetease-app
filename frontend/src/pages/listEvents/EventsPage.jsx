// src/pages/EventsPage.jsx

import React, { useState, useEffect } from 'react';

const EventsPage = () => {
  // Establece el estado para los eventos
  const [events, setEvents] = useState([]);

  // Simula la carga de eventos desde una API
  useEffect(() => {
    // Aquí podrías realizar una solicitud a una API, por ejemplo usando fetch o axios.
    // Vamos a simular con un array estático para el ejemplo.

    const fetchEvents = () => {
      const eventList = [
        { id: 1, name: 'Concierto de Rock', date: '2025-05-10' },
        { id: 2, name: 'Charla sobre React', date: '2025-05-15' },
        { id: 3, name: 'Taller de JavaScript', date: '2025-06-01' },
      ];
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Eventos</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
