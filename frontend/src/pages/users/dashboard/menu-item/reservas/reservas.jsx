import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { GrFavorite } from "react-icons/gr";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import "./reservas.css";

const Reservas = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ticket/findTickets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_user: user.id }),
                });

                const data = await response.json();
                if (response.ok) {
                    setTickets(data.data);
                } else {
                    console.error("❌ Error:", data.message);
                }
            } catch (error) {
                console.error("❌ Error al obtener tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTickets();
    }, [user]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return { day, month };
    };

    const handleInfoEvent = (event) => {
        console.log("Evento:", event);
    };

    return (
        <main className="feed-main-ticket">
            {loading ? (
                <p className="loading-text" style={{ color: 'black' }}>Cargando eventos...</p>
            ) : tickets.length === 0 ? (
                <p className="loading-text">No tienes eventos reservados.</p>
            ) : (
                tickets.map(event => {
                    const { day, month } = formatDate(event.date);
                    return (
                        <div className="event-card-ticket-vertical" key={event.id_event} onClick={() => handleInfoEvent(event)}>
                            <div className="event-content-left">
                                <h3 className="event-title">{event.title}</h3>
                                <p><FaCalendarAlt /> {day} {month}</p>
                                <p><FaClock /> {event.time}</p>
                                <p><FaMapMarkerAlt /> {event.address}, {event.location_name}</p>
                            </div>
                            <div className="event-content-right">
                                <p><FaTicketAlt /> Tipo: <strong>{event.type_tickets}</strong></p>
                                <p>Cantidad: <strong>{event.cant_entradas}</strong></p>
                                <button className="btn_pago">Pagar</button>
                            </div>
                        </div>
                    );
                })
            )}
        </main>
    );
};

export default Reservas;
