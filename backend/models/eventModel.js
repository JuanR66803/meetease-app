import pool from "../config/db.js";

export const createEvent = async (title, date, location, lat, lng, price, capacity, imageUrl = null) => {
    try {
        const query = `
            INSERT INTO events (title, date, location, lat, lng, price, capacity, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *;
        `;

        const values = [title, date, location, lat, lng, price, capacity, imageUrl || null];

        const { rows } = await pool.query(query, values);

        console.log("✅ Evento creado con éxito:", rows[0]);
        return rows[0];
    } catch (error) {
        console.error("❌ Error en createEvent:", error);
        throw error;
    }
};


