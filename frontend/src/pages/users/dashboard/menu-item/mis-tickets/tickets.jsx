import "./tickets.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import QRCode from "react-qr-code";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return { day, month };
    };

    const handlePrint = (ticketId) => {
        const content = document.getElementById(`ticket-${ticketId}`).innerHTML;
        const printWindow = window.open('', '', 'width=400,height=600');
        printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Ticket</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
                .ticket-print { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; }
                h3 { margin: 0; font-size: 20px; }
                p { margin: 6px 0; font-size: 14px; }
                .qr { margin-top: 12px; }
                img { width: 100px; height: 100px; object-fit: cover; border-radius: 6px; }
            </style>
        </head>
        <body><div class="ticket-print">${content}</div></body>
        </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ticket/findTickets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id_user: user.id, status: "confirmado" }),
                });

                const data = await response.json();
                if (response.ok) {
                    setTickets(data.data);
                } else {
                    console.error("❌ Error al obtener tickets:", data.message);
                }
            } catch (error) {
                console.error("❌ Error al obtener tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTickets();
    }, [user]);

    return (
        <main className="feed-main-ticket_q">
            {loading ? (
                <p className="loading-text_q">Cargando eventos...</p>
            ) : tickets.length === 0 ? (
                <p className="loading-text_q">No tienes eventos reservados.</p>
            ) : (
                tickets.map(ticketItem => {
                    const { day, month } = formatDate(ticketItem.date);
                    return (
                        <div className="ticket-wrapper" key={ticketItem.id_tickets} id={`ticket-${ticketItem.id_tickets}`}>
                            <div className="ticket-header">
                                <img src={ticketItem.image_url} alt={ticketItem.title} className="ticket-image" />
                                <div className="ticket-title-group">
                                    <h3>{ticketItem.title}</h3>
                                    <span className="ticket-type">{ticketItem.type_event}</span>
                                </div>
                            </div>

                            <div className="ticket-info">
                                <p><FaCalendarAlt /> {day} {month} — {ticketItem.time}</p>
                                <p><FaMapMarkerAlt /> {ticketItem.location_name}, {ticketItem.address}</p>
                                <p><strong>Lugar:</strong> {ticketItem.location}</p>
                                <p><FaTicketAlt /> Tipo: <strong>{ticketItem.type_tickets}</strong></p>
                                <p><strong>Cantidad:</strong> {ticketItem.cant_entradas}</p>
                            </div>

                            <div className="ticket-footer">
                                <div className="qr-code-box">
                                    <QRCode value={ticketItem.qr_code} size={100} />
                                </div>
                                <button className="print-btn_q" onClick={() => handlePrint(ticketItem.id_tickets)}>
                                    Imprimir ticket
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </main>
    );
};

export default Tickets;
