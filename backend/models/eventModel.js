import pool from "../config/db.js";

export const createEvent = async (
    title,
    date,
    location,
    price,
    capacity,
    image_url,
    lat,
    lng,
    type_event,
    id_organizer,
    location_name,
    address,
    time,
    description
) => {
    const query = `
        INSERT INTO events (
            title,
            date,
            location,
            price,
            capacity,
            image_url,
            lat,
            lng,
            type_event,
            id_organizer,
            location_name,
            address,
            time,
            description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
    `;

    const values = [
        title,
        date,
        location,
        price,
        capacity,
        image_url,
        lat,
        lng,
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

export const findEventFeed = async () => {
    const query = `SELECT * FROM events ORDER BY date DESC;`;
    const result = await pool.query(query);
    return result.rows;
};

export const findEventById = async (id_event) => {
    const query = `SELECT * FROM events WHERE id = $1 LIMIT 1;`;
    const result = await pool.query(query, [id_event]);
    return result.rows[0];
};
