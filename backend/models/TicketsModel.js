// models/TicketsModel.js (o ticketModel.js, según el nombre de tu archivo)
import pool from "../config/db.js"; // Asegúrate de que esta ruta sea correcta

// 1. Función para GENERAR/INSERTAR un nuevo ticket
export const GenerarTicket = async (id_event, id_user, type_tickets, qr_code, reserve_status,cant_entradas) => {
    // El estado inicial será 'reservado' como lo tienes en tu DB
    const query = `
        INSERT INTO ticket(id_event, id_user, type_tickets, qr_code, reserve_status, cant_entradas)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`; 
    const values = [id_event, id_user, type_tickets, qr_code, reserve_status, cant_entradas];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// 2. Función para ENCONTRAR tickets (para el frontend de "mis reservas")
export const FindTicket = async (id_user,status) => {
    const query = `
        SELECT * FROM events RIGHT JOIN ticket ON events.id = ticket.id_event WHERE ticket.id_user = $1 AND ticket.reserve_status = $2;`; // Solo tickets con estado 'reservado'
    const values = [id_user,status];
    const result = await pool.query(query, values);
    return result.rows;
};

// 3. NUEVA FUNCIÓN: Actualizar el estado de reserva de un ticket
export const UpdateTicketReserveStatus = async (id_tickets, newStatus) => { // id_tickets, no id_ticket
    const query = `
        UPDATE ticket
        SET 
            reserve_status = $1
        WHERE 
            id_tickets = $2 -- Usamos id_tickets
        RETURNING *;`; 
    const values = [newStatus, id_tickets];
    const result = await pool.query(query, values);
    return result.rows[0]; 
};

// 4. NUEVA FUNCIÓN: Obtener un ticket específico POR ID_TICKETS y verificar su estado 'reservado'
export const GetReservedTicketById = async (id_tickets) => { // id_tickets, no id_ticket
    const query = `
        SELECT * FROM ticket t JOIN events e ON t.id_event = e.id WHERE t.id_tickets = $1 AND t.reserve_status = 'reservado'; 
    `;
    const values = [id_tickets];
    const result = await pool.query(query, values);
    return result.rows[0]; 
};

// Opcional: Función para obtener varios tickets pendientes si una compra cubre más de uno
// export const GetReservedTicketsByEventUserTypeQuantity = async (id_event, id_user, type_tickets, cant_entradas) => {
//     const query = `
//         SELECT 
//             t.id_tickets, t.id_event, t.id_user, t.cant_entradas, t.type_tickets,
//             e.price, e.title, e.date, e.time, e.address, e.location_name
//         FROM ticket t
//         JOIN events e ON t.id_event = e.id
//         WHERE 
//             t.id_event = $1 AND 
//             t.id_user = $2 AND 
//             t.type_tickets = $3 AND
//             t.cant_entradas = $4 AND
//             t.reserve_status = 'reservado';
//     `;
//     const values = [id_event, id_user, type_tickets, cant_entradas];
//     const result = await pool.query(query, values);
//     return result.rows;
// };