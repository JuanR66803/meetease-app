import "./feed.css";
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GrFavorite } from "react-icons/gr";
import { useAuth } from "../../../context/AuthContext"; // Asegúrate de que esta ruta sea correcta
import StaticMap from "../../../components/StaticMap";
import { IoMdClose } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";

const Feed = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterType, setFilterType] = useState("");
    const [numEntradas, setNumEntradas] = useState(1);
    const [message, setMessage] = useState("");
    const [qrCodeGenerated, setQrCodeGenerated] = useState("");



    const HandleReserva = async (e) => {
        e.preventDefault();
        setMessage("");

        // Validación rápida
        if (!selectedEvent || !user) {
            setMessage("Falta información del evento o del usuario.");
            return;
        }

        // Generar código QR aleatorio
        const generateQrCode = () => {
            return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        };

        const qrCode = generateQrCode();

        const payload = {
            id_event: selectedEvent.id,
            id_user: user.id,
            type_tickets: "general", // Puedes ajustar según tu lógica
            qr_code: qrCode,
            reserve_status: "reservado",
            cant_entradas:numEntradas
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ticket/generateTicket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al generar el ticket");
            }

            setMessage("Ticket generado exitosamente ✅");
            setQrCodeGenerated(qrCode); // (opcional, para mostrarlo más adelante si quieres con canvas)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(error.message);
        }
    };


    const filterRef = useRef(null);

    const toggleFilters = () => setShowFilters(true);

    // Ocultar filtros si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/events/feed`)
            .then(res => res.json())
            .then(data => {
                console.log("Datos del backend:", data);
                setEvents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener eventos:", error);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
        const matchesDate = filterDate ? event.date.startsWith(filterDate) : true;
        const matchesType = filterType ? event.type_event === filterType : true;
        return matchesSearch && matchesDate && matchesType;
    });

    const handleInfoEvent = (event) => {
        setShowModalInfo(true);
        setSelectedEvent(event);
    };

    return (
        <div className="feed-layout">
            <div className="fondo_encabezado">
                <h1 className="title_feed"><span>Explora</span> los mejores eventos cerca de ti</h1>
                <div className="overlay_text">
                    <h2 className="subtitle_feed">haz que tu experiencia sea inolvidable</h2>
                </div>
                <div className="barra_busqueda">
                    <IoSearchOutline style={{ fontSize: '28px', margin: '5px 0 0 8px' }} />
                    <input
                        type="text"
                        placeholder="Busca un evento"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={toggleFilters}
                    />
                </div>

                {showFilters && (
                    <div className="filtro-expandido" ref={filterRef}>
                        <label>
                            Buscar por fecha:
                            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                        </label>
                        <label>
                            Tipo de evento:
                            <select
                                className="event_type"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="Concierto">Concierto</option>
                                <option value="Conferencia">Conferencia</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Fiesta">Fiesta</option>
                                <option value="Corporativo">Corporativo</option>
                            </select>
                        </label>
                        <button onClick={() => setShowFilters(false)}>Cerrar</button>
                    </div>
                )}
            </div>

            <main className="feed-main">
                {loading ? (
                    <p className="loading-text">Cargando eventos...</p>
                ) : filteredEvents.length === 0 ? (
                    <p className="loading-text">No hay eventos disponibles.</p>
                ) : (
                    filteredEvents.map(event => {
                        const { day, month } = formatDate(event.date);
                        return (
                            <div className="event-card" key={event.id} onClick={() => handleInfoEvent(event)}>
                                <div className="event-favorite">
                                    <GrFavorite style={{ color: '#fff', fontSize: '30px' }} />
                                </div>
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="event-image"
                                />
                                <div className="event-details">
                                    <h3>{event.title}</h3>
                                    <div className="event-info">
                                        <p>{day} {month} - {event.time}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            {showModalInfo && selectedEvent && (
                <div className="container_modal">
                    <div className="content_modal">
                        <div className="imagen_event">
                            <img src={selectedEvent.image_url} alt={selectedEvent.title} />
                        </div>
                        <h2 className="title_modal">{selectedEvent.title}</h2>
                        <p className="date_modal">
                            {formatDate(selectedEvent.date).day} {formatDate(selectedEvent.date).month} - {selectedEvent.time}
                        </p>
                        <p className="text_info">
                            Nombre del programador del evento (ID: {selectedEvent.id_organizer})
                        </p>
                        <p className="text_info"><CiLocationOn style={{ fontSize: '30px' }} /> {selectedEvent.location_name} - {selectedEvent.address}</p>
                        <p className="text_info">{selectedEvent.description}</p>
                        <div className="mapa_modal">
                            <StaticMap lat={selectedEvent.lat}
                                lon={selectedEvent.lng}
                                name={selectedEvent.location} />
                        </div>
                        <button className="btn-cerrar" onClick={() => setShowModalInfo(false)}><IoMdClose /></button>
                        <div>
                            <label className="label_entradas" htmlFor="entradas">
                                Cantidad de entradas:
                            </label>
                            <div className="container-entradas">
                                <input
                                    className="Number-entradas"
                                    type="number"
                                    id="entradas"
                                    name="entradas"
                                    min="1"
                                    max="20"
                                    value={numEntradas}
                                    onChange={(e) => setNumEntradas(Number(e.target.value))}
                                />
                                <p className="precio-total">
                                    Precio total: ${new Intl.NumberFormat('es-CO').format(selectedEvent.price * numEntradas)} COP
                                </p>
                            </div>


                            <button className="action_btn" onClick={HandleReserva}>
                                Reservar Entradas
                            </button>
                        </div>
                    </div>
                    {message && (
                        <div className={`status-message-ticket ${message.includes("exitosamente") ? "success-message" : "error-message"}`}>
                            {message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
