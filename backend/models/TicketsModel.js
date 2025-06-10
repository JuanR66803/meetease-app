import pool from "../config/db.js";

const GenerarTicket = async (
    id_event,
    id_user,
    type_tickets,
    qr_code,
    reserve_status,
    cant_entradas
) =>{
    const query = `INSERT INTO ticket(id_event,id_user,type_tickets,qr_code,reserve_status,cant_entradas) VALUES ($1,$2,$3,$4,$5,$6)`;
    const values = [id_event,id_user,type_tickets,qr_code,reserve_status,cant_entradas];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export default GenerarTicket;