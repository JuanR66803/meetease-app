import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import "./reservas.css";

const Reservas = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [selectedTicket, setSelectedTicket] = useState(null);
    const paypalButtonRef = useRef();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return { day, month };
    };

    const fetchTickets = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ticket/findTickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id_user: user.id, status: "reservado" }),
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

    useEffect(() => {
        if (user) fetchTickets();
    }, [user]);

    // CONFIRMAR TICKETS GRATUITOS AUTOMÁTICAMENTE
    const confirmarEntradaGratuita = async (ticket) => {
        try {
            console.log(ticket)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/payments/confirm-free-ticket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_tickets: ticket.id_tickets,
                    id_event: ticket.id_event,
                    id_user: user.id,
                    type_tickets: ticket.type_tickets,
                    cant_entradas: ticket.cant_entradas
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert("✅ Entrada gratuita confirmada. Puedes verla en 'Mis Tickets'.");
                setTickets(prev => prev.filter(t => t.id_tickets !== ticket.id_tickets));
            } else {
                alert("❌ No se pudo confirmar el ticket gratuito: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error al confirmar entrada gratuita:", error);
            alert("Ocurrió un error al confirmar el ticket gratuito.");
        }
    };

    // RENDERIZAR PAYPAL SI SELECCIONADO Y NO ES GRATIS
    useEffect(() => {
        if (
            selectedTicket &&
            selectedTicket.price > 0 &&
            paypalButtonRef.current &&
            window.paypal
        ) {
            paypalButtonRef.current.innerHTML = '';

            window.paypal.Buttons({
                createOrder: () => {
                    return fetch(`${import.meta.env.VITE_API_URL}/api/payments/paypal/create-order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id_ticket: selectedTicket.id_tickets,
                            id_user: user.id,
                            quantity: selectedTicket.cant_entradas,
                            type: selectedTicket.type_tickets,
                            description: `Entradas para ${selectedTicket.title} (${selectedTicket.cant_entradas} x ${selectedTicket.type_tickets})`,
                        }),
                    })
                    .then(res => res.json())
                    .then(order => order.id)
                    .catch(err => {
                        console.error("Error creando orden:", err);
                        alert("Error al crear la orden de PayPal.");
                        setSelectedTicket(null);
                    });
                },

                onApprove: (data) => {
                    return fetch(`${import.meta.env.VITE_API_URL}/api/payments/paypal/capture-order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderID: data.orderID,
                            ticketDetails: {
                                id_tickets: selectedTicket.id_tickets,
                                id_event: selectedTicket.id_event,
                                id_user: user.id,
                                type_tickets: selectedTicket.type_tickets,
                                cant_entradas: selectedTicket.cant_entradas,
                            },
                        }),
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status === 'COMPLETED') {
                            alert("✅ ¡Pago exitoso!");
                            setTickets(prev => prev.filter(t => t.id_tickets !== selectedTicket.id_tickets));
                            setSelectedTicket(null);
                        } else {
                            alert("❌ El pago no fue completado.");
                        }
                    })
                    .catch(err => {
                        console.error("Error capturando orden:", err);
                        alert("Error al capturar el pago.");
                    });
                },

                onCancel: () => {
                    alert("Has cancelado el pago.");
                    setSelectedTicket(null);
                },

                onError: (err) => {
                    console.error("Error de PayPal:", err);
                    alert("Ocurrió un error con PayPal.");
                    setSelectedTicket(null);
                },
            }).render(paypalButtonRef.current);
        }
    }, [selectedTicket]);

    const handlePaymentClick = (ticket) => {
        if (Number(ticket.price) === 0) {
            confirmarEntradaGratuita(ticket);
        } else {
            setSelectedTicket(ticket);
        }
    };

    return (
        <main className="feed-main-ticket">
            {loading ? (
                <p className="loading-text" style={{ color: 'black' }}>Cargando eventos...</p>
            ) : tickets.length === 0 ? (
                <p className="loading-text">No tienes eventos reservados.</p>
            ) : (
                tickets.map(ticket => {
                    const { day, month } = formatDate(ticket.date);
                    return (
                        <div className="event-card-ticket-vertical" key={ticket.id_tickets}>
                            <div className="event-content-left">
                                <h3 className="event-title">{ticket.title}</h3>
                                <p><FaCalendarAlt /> {day} {month}</p>
                                <p><FaClock /> {ticket.time}</p>
                                <p><FaMapMarkerAlt /> {ticket.address}, {ticket.location_name}</p>
                            </div>
                            <div className="event-content-right">
                                <p><FaTicketAlt /> Tipo: <strong>{ticket.type_tickets}</strong></p>
                                <p>Cantidad: <strong>{ticket.cant_entradas}</strong></p>
                                <p>Precio Unitario: <strong>${ticket.price} COP</strong></p>
                                <p>Total: <strong>${ticket.price * ticket.cant_entradas} COP</strong></p>
                                <button className="btn_pago" onClick={() => handlePaymentClick(ticket)}>
                                    {Number(ticket.price) === 0 ? "Confirmar Gratis" : "Pagar"}
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

            {selectedTicket && selectedTicket.price > 0 && (
                <div className="paypal-modal-overlay">
                    <div className="paypal-modal-content">
                        <h2>Confirmar Pago</h2>
                        <p>Estás a punto de pagar por:</p>
                        <p><strong>Evento:</strong> {selectedTicket.title}</p>
                        <p><strong>Tipo de Ticket:</strong> {selectedTicket.type_tickets}</p>
                        <p><strong>Cantidad:</strong> {selectedTicket.cant_entradas}</p>
                        <p><strong>Total (COP):</strong> ${selectedTicket.price * selectedTicket.cant_entradas}</p>
                        <p className="small-text">El monto final en USD se calculará automáticamente.</p>

                        <div ref={paypalButtonRef} id="paypal-button-container"></div>

                        <button onClick={() => setSelectedTicket(null)} className="close-paypal-modal">Cerrar</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Reservas;
