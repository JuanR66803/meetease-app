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
    const ticket = tickets.find(t => t.id_tickets === ticketId);
    if (!ticket) return;

    const { day, month } = formatDate(ticket.date);
    
    const printWindow = window.open('', '', 'width=800,height=900');
    printWindow.document.write(`
    <html>
    <head>
        <title>Meet-Ease</title>
        <style>
            * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
            
                body { 
                    font-family: 'Arial', sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .ticket-container {
                    max-width: 600px; 
                    width: 100%;
                    background: white; 
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                    margin: 0 auto;
                }
                
                /* Header con gradiente */
                .ticket-header {
                    padding: 30px;
                    text-align: center;
                    color: white;
                    position: relative;
                }
                
                .ticket-header h3 { 
                    font-size: 28px; 
                    font-weight: bold;
                    margin: 15px 0 10px 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    color: white;
                }
                
                .ticket-type {
                    background: rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: bold;
                    display: inline-block;
                    margin-top: 10px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                }
                
                /* Imagen del evento */
                .ticket-image { 
                    width: 120px; 
                    height: 120px; 
                    object-fit: cover; 
                    border-radius: 15px;
                    border: 4px solid white;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    margin: 0 auto 20px auto;
                    display: block;
                }
                
                /* Información del ticket - CENTRADA */
                .ticket-info {
                    padding: 30px;
                    background: white;
                    text-align: center;
                }
                
                .info-row {
                    margin: 15px 0;
                    font-size: 16px;
                    color: #333;
                    line-height: 1.6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .info-row strong {
                    color: #2c3e50;
                    font-weight: 600;
                }
                
                /* Sección del QR - CON TEXTO AL LADO */
                .ticket-footer {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 30px;
                    border-top: 3px dashed #ddd;
                    position: relative;
                }
                
                .qr-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 25px;
                    margin-bottom: 20px;
                }
                
                .qr-code-box {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    border: 2px solid #ff6b6b;
                    flex-shrink: 0;
                }
                
                .qr-text-side {
                    font-size: 16px;
                    color: #333;
                    font-weight: 600;
                    max-width: 200px;
                    text-align: left;
                    line-height: 1.5;
                }
                
                /* Línea decorativa */
                .decorative-line {
                    height: 3px;
                    background: linear-gradient(90deg, #ff6b6b, #ffa726, #42a5f5, #ab47bc);
                    margin: 0;
                    border-radius: 2px;
                    width: 100%;
                }
            @media print {
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
            
                body { 
                    font-family: 'Arial', sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .ticket-container {
                    max-width: 600px; 
                    width: 100%;
                    background: white; 
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                    margin: 0 auto;
                }
                
                /* Header con gradiente */
                .ticket-header {
                    background: linear-gradient(135deg, #ff6b6b,rgb(102, 62, 3));
                    padding: 30px;
                    text-align: center;
                    color: white;
                    position: relative;
                }
                
                .ticket-header h3 { 
                    font-size: 28px; 
                    font-weight: bold;
                    margin: 15px 0 10px 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    color: white;
                }
                
                .ticket-type {
                    background: rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: bold;
                    display: inline-block;
                    margin-top: 10px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                }
                
                /* Imagen del evento */
                .ticket-image { 
                    width: 120px; 
                    height: 120px; 
                    object-fit: cover; 
                    border-radius: 15px;
                    border: 4px solid white;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    margin: 0 auto 20px auto;
                    display: block;
                }
                
                /* Información del ticket - CENTRADA */
                .ticket-info {
                    padding: 30px;
                    background: white;
                    text-align: center;
                }
                
                .info-row {
                    margin: 15px 0;
                    font-size: 16px;
                    color: #333;
                    line-height: 1.6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .info-row strong {
                    color: #2c3e50;
                    font-weight: 600;
                }
                
                /* Sección del QR - CON TEXTO AL LADO */
                .ticket-footer {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 30px;
                    border-top: 3px dashed #ddd;
                    position: relative;
                }
                
                .qr-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 25px;
                    margin-bottom: 20px;
                }
                
                .qr-code-box {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    border: 2px solid #ff6b6b;
                    flex-shrink: 0;
                }
                
                .qr-text-side {
                    font-size: 16px;
                    color: #333;
                    font-weight: 600;
                    max-width: 200px;
                    text-align: left;
                    line-height: 1.5;
                }
                
                /* Efectos decorativos */
                .ticket-container::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -15px;
                    width: 30px;
                    height: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                }
                
                .ticket-container::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: -15px;
                    width: 30px;
                    height: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                }
                
                /* Línea decorativa */
                .decorative-line {
                    height: 3px;
                    background: linear-gradient(90deg, #ff6b6b, #ffa726, #42a5f5, #ab47bc);
                    margin: 0;
                    border-radius: 2px;
                    width: 100%;
                }
                
                /* Responsive para pantallas pequeñas */
                @media (max-width: 600px) {
                    .qr-section {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .qr-text-side {
                        text-align: center;
                        max-width: none;
                    }
                }
            }
        </style>
    </head>
    <body>
        <div class="ticket-container">
            <div class="ticket-header">
                <img src="${ticket.image_url}" alt="${ticket.title}" class="ticket-image" />
                <h3>${ticket.title}</h3>
                <span class="ticket-type">${ticket.type_event}</span>
            </div>

            <div class="ticket-info">
                <div class="info-row">
                    <span>${day} ${month} — ${ticket.time}</span>
                </div>
                <div class="info-row">
                    <span>${ticket.location_name}, ${ticket.address}</span>
                </div>
                <div class="info-row">
                    <span><strong>Lugar:</strong> ${ticket.location}</span>
                </div>
                <div class="info-row">
                    <span>Tipo: <strong>${ticket.type_tickets}</strong></span>
                </div>
                <div class="info-row">
                    <span><strong>Cantidad:</strong> ${ticket.cant_entradas}</span>
                </div>
            </div>

            <div class="ticket-footer">
                <div class="qr-section">
                    <div class="qr-code-box">
                        <div id="qr-code-container"></div>
                    </div>
                    <div class="qr-text-side">
                        <strong>Presenta este código QR en el evento</strong> para validar tu entrada
                    </div>
                </div>
                <div class="decorative-line"></div>
            </div>
        </div>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
        <script>
            // Generar QR code
            const qr = qrcode(0, 'L');
            qr.addData('${ticket.qr_code}');
            qr.make();
            document.getElementById('qr-code-container').innerHTML = qr.createImgTag(4);
        </script>
    </body>
    </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
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
