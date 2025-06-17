import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import "./reservas.css"; // Asegúrate de tener tus estilos CSS aquí

const Reservas = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Estado para el ticket seleccionado para pagar
    const [selectedTicket, setSelectedTicket] = useState(null);
    // Ref para el contenedor del botón de PayPal
    const paypalButtonRef = useRef();

    // Función auxiliar para formatear la fecha
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return { day, month };
    };

    // 1. useEffect para obtener los tickets pendientes de pago
    useEffect(() => {
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

        if (user) fetchTickets();
    }, [user]); 

    // 2. useEffect para renderizar el botón de PayPal
    useEffect(() => {
        // Solo renderiza si hay un ticket seleccionado Y el script de PayPal ya está cargado
        if (selectedTicket && paypalButtonRef.current && window.paypal) {
            // Limpiamos el contenido previo del contenedor del botón para evitar duplicados
            paypalButtonRef.current.innerHTML = ''; 

            // Asegúrate de que el script SDK de PayPal esté cargado en tu index.html
            // <script src={`https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`}></script>

            window.paypal.Buttons({
                // Función que se llama para crear la orden en PayPal (llamada a tu backend)
                // eslint-disable-next-line no-unused-vars
                createOrder: (data, actions) => {
                    return fetch(`${import.meta.env.VITE_API_URL}/api/payments/paypal/create-order`, { // Ruta corregida
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            // ¡Importante! Ahora enviamos id_tickets, no amount directamente.
                            // El backend calculará el monto y la conversión.
                            id_ticket: selectedTicket.id_tickets, // Usa id_tickets para enviar al backend
                            id_user: user.id, // También es útil enviar el ID del usuario
                            quantity: selectedTicket.cant_entradas, // Cantidad de entradas de este ticket
                            type: selectedTicket.type_tickets, // Tipo de ticket (general, VIP, etc.)
                            description: `Entradas para ${selectedTicket.title} (${selectedTicket.cant_entradas} x ${selectedTicket.type_tickets})`,
                        })
                    })
                    .then(response => response.json())
                    .then(order => {
                        if (order.id) {
                            return order.id; // Retorna el ID de la orden de PayPal
                        } else {
                            throw new Error('No se pudo crear la orden de PayPal. Recibido: ' + JSON.stringify(order));
                        }
                    })
                    .catch(error => {
                        console.error("Error al crear la orden de PayPal:", error);
                        alert("Hubo un problema al iniciar el pago. Inténtalo de nuevo.");
                        setSelectedTicket(null); // Oculta el modal de pago
                        return Promise.reject(error); // Rechaza la promesa para evitar que PayPal continúe
                    });
                },
                // Función que se llama cuando el usuario aprueba la transacción en PayPal
                onApprove: (data, actions) => {
                    // Esta llamada va a tu backend para CAPTURAR el pago
                    return fetch(`${import.meta.env.VITE_API_URL}/api/payments/paypal/capture-order`, { // Ruta corregida
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderID: data.orderID, // El ID de la orden que PayPal te da
                            // Envías los detalles del ticket al backend, incluyendo id_tickets
                            ticketDetails: { 
                                id_tickets: selectedTicket.id_tickets, // Asegúrate de enviar id_tickets
                                id_event: selectedTicket.id_event, 
                                id_user: user.id, 
                                type_tickets: selectedTicket.type_tickets,
                                cant_entradas: selectedTicket.cant_entradas,
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(captureDetails => {
                        console.log("Pago capturado:", captureDetails);
                        if (captureDetails.status === 'COMPLETED') {
                            alert("¡Pago exitoso! Gracias por tu compra.");
                            // Filtra el ticket pagado del estado local usando id_tickets
                            setTickets(prevTickets => 
                                prevTickets.filter(t => t.id_tickets !== selectedTicket.id_tickets) // Usa id_tickets para filtrar
                            );
                            setSelectedTicket(null); // Oculta el popup de pago
                            // Opcional: podrías recargar la lista de tickets para asegurar consistencia
                            // fetchTickets(); 
                        } else {
                            alert("El pago no se completó. Por favor, inténtalo de nuevo.");
                        }
                    })
                    .catch(error => {
                        console.error("Error al capturar el pago:", error);
                        alert("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
                    });
                },
                // Función que se llama si el usuario cancela el pago
                onCancel: (data) => {
                    console.log('Pago cancelado:', data);
                    alert('Has cancelado el pago.');
                    setSelectedTicket(null); // Cierra el popup o modal
                },
                // Función para manejar errores durante el proceso de pago
                onError: (err) => {
                    console.error("Error de PayPal:", err);
                    alert("Ocurrió un error con PayPal. Por favor, inténtalo de nuevo.");
                    setSelectedTicket(null); // Cierra el popup o modal
                }
            }).render(paypalButtonRef.current); // Renderiza los botones en el div referenciado
        } else if (!selectedTicket && paypalButtonRef.current) {
            // Si no hay ticket seleccionado y el ref existe, limpia el contenido (para esconder el botón)
            paypalButtonRef.current.innerHTML = '';
        }
    }, [selectedTicket, user]); // Dependencias: Se ejecuta cuando selectedTicket o user cambian

    // Función para manejar el clic en el botón "Pagar"
    const handlePaymentClick = (ticketToPay) => {
        console.log("🖱️ Clic en Pagar. Ticket seleccionado:", ticketToPay); // Renombrado para mayor claridad
        setSelectedTicket(ticketToPay);
         // Guarda el ticket que se va a pagar
    };

    return (
        <main className="feed-main-ticket">
            {loading ? (
                <p className="loading-text" style={{ color: 'black' }}>Cargando eventos...</p>
            ) : tickets.length === 0 ? (
                <p className="loading-text">No tienes eventos reservados.</p>
            ) : (
                tickets.map(ticketItem => { // Renombrado a ticketItem para evitar conflictos
                    const { day, month } = formatDate(ticketItem.date);
                    return (
                        <div className="event-card-ticket-vertical" key={ticketItem.id_tickets}> {/* Usa id_tickets como key */}
                            <div className="event-content-left">
                                <h3 className="event-title">{ticketItem.title}</h3>
                                <p><FaCalendarAlt /> {day} {month}</p>
                                <p><FaClock /> {ticketItem.time}</p>
                                <p><FaMapMarkerAlt /> {ticketItem.address}, {ticketItem.location_name}</p>
                            </div>
                            <div className="event-content-right">
                                <p><FaTicketAlt /> Tipo: <strong>{ticketItem.type_tickets}</strong></p>
                                <p>Cantidad: <strong>{ticketItem.cant_entradas}</strong></p>
                                {/* Muestra el precio unitario y el total en COP para información del usuario */}
                                <p>Precio Unitario: <strong>${ticketItem.price} COP</strong></p>
                                <p>Total a Pagar: <strong>${ticketItem.price * ticketItem.cant_entradas} COP</strong></p>
                                <button className="btn_pago" onClick={() => handlePaymentClick(ticketItem)}>Pagar</button>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Este es el popup/modal donde aparecerá el botón de PayPal */}
            {selectedTicket && (
                <div className="paypal-modal-overlay">
                    <div className="paypal-modal-content">
                        <h2>Confirmar Pago</h2>
                        <p>Estás a punto de pagar por:</p>
                        <p><strong>Evento:</strong> {selectedTicket.title}</p>
                        <p><strong>Tipo de Ticket:</strong> {selectedTicket.type_tickets}</p>
                        <p><strong>Cantidad:</strong> {selectedTicket.cant_entradas}</p>
                        <p><strong>Total (COP):</strong> ${selectedTicket.price * selectedTicket.cant_entradas} COP</p>
                        <p className="small-text">El monto final en USD será calculado al momento del pago.</p>
                        
                        {/* Contenedor donde se renderizará el botón de PayPal */}
                        <div ref={paypalButtonRef} id="paypal-button-container"></div>

                        <button onClick={() => setSelectedTicket(null)} className="close-paypal-modal">Cerrar</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Reservas;