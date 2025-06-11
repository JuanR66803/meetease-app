import pool from "../config/db.js";

export const GenerarTicket = async (id_event,id_user,type_tickets,qr_code,reserve_status,cant_entradas) =>{
    const query = `INSERT INTO ticket(id_event,id_user,type_tickets,qr_code,reserve_status,cant_entradas) VALUES ($1,$2,$3,$4,$5,$6)`;
    const values = [id_event,id_user,type_tickets,qr_code,reserve_status,cant_entradas];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const FindTicket = async(id_user)=>{
    const query = `SELECT title,date,time,cant_entradas,type_tickets,address,location_name,type_event FROM events RIGHT JOIN ticket ON events.id = ticket.id_event WHERE ticket.id_user = $1`;
    const values = [id_user];
    const result = await pool.query(query,values);
    return result.rows;
    
};
