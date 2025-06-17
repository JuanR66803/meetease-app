// models/paymentModel.js
import pool from "../config/db.js"; // Asegúrate de que esta ruta sea correcta

export const InsertPaymentRecord = async (
    id_ticket_fk, // Renombrado para indicar que es la FK de la tabla ticket
    payment_method, 
    price, // Este es el precio de la transacción en USD
    payment_status, 
    paypal_order_id, 
    paypal_transaction_id 
) => {
    const query = `
        INSERT INTO pay(
            id_ticket, -- Tu columna en la DB es 'id_ticket' (sin la 's')
            payment_method, 
            price, 
            payment_date, 
            payment_status,
            paypal_order_id, -- Necesitas añadir esta columna en tu tabla payments
            paypal_transaction_id -- Necesitas añadir esta columna en tu tabla payments
        )
        VALUES ($1, $2, $3, NOW(), $4, $5, $6)
        RETURNING *;`;
    const values = [
        id_ticket_fk, 
        payment_method, 
        price, 
        payment_status,
        paypal_order_id,
        paypal_transaction_id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Puedes añadir otras funciones aquí si necesitas buscar pagos, etc.
