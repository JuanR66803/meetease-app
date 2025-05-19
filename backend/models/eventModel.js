import pool from "../config/db.js";

export const createEvent = async (title,date,location,lat,lng,price,capacity,image_url,type_event,id_organizer,location_name,address,time,description) => {
    const query = `
        INSERT INTO events (
            title,
            date,
            location,
            lat,
            lng,
            price,
            capacity,
            image_url,
            type_event,
            id_organizer,
            location_name,
            address,
            time,
            description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
    `;

    const values = [
        title,
        date,
        location,
        lat,
        lng,
        price,
        capacity,
        image_url,
        type_event,
        id_organizer,
        location_name,
        address,
        time,
        description
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


