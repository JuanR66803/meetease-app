import pool from "../config/db.js";

//* 🔹 Función para buscar usuario por email*
export const findUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error en findUserByEmail:", error);
        throw error;
    }
};

//* 🔹 Función para crear un nuevo usuario (registro normal)*
export const createUser = async (name, email, password) => {
    try {
        const { rows } = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password]
        );
        return rows[0];
    } catch (error) {
        console.error("Error en createUser:", error);
        throw error;
    }
};

//* 🔹 Función para crear un nuevo usuario con Google*
export const createGoogleUser = async (name, email, password, image_url) => {
    try {
        console.log("🛠 Creando nuevo usuario de Google en PostgreSQL...");
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password, auth_provider, image_url) 
             VALUES ($1, $2, $3, 'google', $4) 
             RETURNING *`,
            [name, email, password, image_url]
        );
        return rows[0];
    } catch (error) {
        console.error("Error en createGoogleUser:", error);
        throw error;
    }
};

//* 🔹 Función para actualizar usuario existente al autenticarse con Google*
export const updateExistingUserWithGoogle = async (userId, name, image_url) => {
    try {
        console.log("Actualizando usuario existente con datos de Google...");
        const { rows } = await pool.query(
            `UPDATE users
             SET name = $1, image_url = $2, auth_provider = 'google'
             WHERE id = $3
             RETURNING *`,
            [name, image_url, userId]
        );
        return rows[0];
    } catch (error) {
        console.error("Error en updateExistingUserWithGoogle:", error);
        throw error;
    }
};

//* 🔹 La función updateUserById original se mantiene para otras actualizaciones*
export const updateUserById = async (id, name, cel, image_url,preferences) => {
    try {
        const { rows } = await pool.query(
            `UPDATE users
             SET name = $1, cel = $2, image_url = $3, preferences = $4
             WHERE id = $5
             RETURNING *`,
            [name, cel, image_url,preferences, id]
        );
        return rows[0];
    } catch (error) {
        console.error("Error en updateUserById:", error);
        throw error;
    }
};