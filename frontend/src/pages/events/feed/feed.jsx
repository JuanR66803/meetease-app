import "./feed.css";
import { useEffect, useState } from "react";

const Feed = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [interactions, setInteractions] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/events/feed`)
            .then(res => res.json())
            .then(data => {
                console.log("📦 Datos del backend:", data);
                setEvents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener eventos:", error);
                setLoading(false);
            });
    }, []);

    // Función para formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    // Funciones para manejar interacciones
    const handleLike = (eventId) => {
        setInteractions(prev => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                liked: !prev[eventId]?.liked,
                likes: prev[eventId]?.liked 
                    ? (prev[eventId]?.likes || 234) - 1 
                    : (prev[eventId]?.likes || 234) + 1
            }
        }));
    };

    const handleSave = (eventId) => {
        setInteractions(prev => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                saved: !prev[eventId]?.saved
            }
        }));
    };

    return (
        <div className="feed-layout">
            {/** Columna izquierda **/}
            <aside className="feed-sidebar left-sidebar">
                {/** Puedes agregar aquí contenido adicional **/}
            </aside>

            {/** Columna central **/}
            <main className="feed-main">
                {loading ? (
                    <p>Cargando eventos...</p>
                ) : events.length === 0 ? (
                    <p>No hay eventos disponibles.</p>
                ) : (
                    events.map(event => {
                        const { day, month } = formatDate(event.date);
                        return (
                            <div className="event-card" key={event.id}>
                                {/* Fecha en esquina superior izquierda */}
                                <div className="event-date-badge">
                                    <div className="date-day">{day}</div>
                                    <div className="date-month">{month}</div>
                                </div>

                                {/* Categoría */}
                                <div className="event-category">{event.type_event}</div>

                                {/* Precio */}
                                <div className="event-price">{event.price}</div>

                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="event-image"
                                />
                                
                                <div className="event-details">
                                    <h3>{event.title}</h3>
                                    <p className="event-type">{event.type_event}</p>
                                    <div className="event-info">
                                        <p><span className="time-icon">🕐</span> {event.time}</p>
                                        <p><span className="location-icon">📍</span> {event.location_name}</p>
                                        <p className="event-note">{event.description}</p>
                                    </div>

                                    <div className="event-actions">
                                        <div className="event-stats">
                                            <button 
                                                className={`interaction-btn like-btn ${interactions[event.id]?.liked ? 'liked' : ''}`}
                                                onClick={() => handleLike(event.id)}
                                            >
                                                <span className="heart-icon">
                                                    {interactions[event.id]?.liked ? '❤️' : '🤍'}
                                                </span>
                                                <span className="count">{interactions[event.id]?.likes || 234}</span>
                                            </button>
                                        </div>
                                        <button className="btn-details">Ver detalles</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            {/** Columna derecha **/}
            <aside className="feed-sidebar right-sidebar">
                {/** Puedes agregar contenido como tendencias, sugerencias, etc **/}
            </aside>
        </div>
    );
};

export default Feed;

