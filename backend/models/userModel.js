import pool  from "../config/db.js";


// 🔹 Función para buscar usuario por email
export const findUserByEmail = async (email) => {
    try {
        console.log("🔍 Buscando usuario en PostgreSQL...");
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return rows[0] || null;
    } catch (error) {
        console.error("❌ Error en findUserByEmail:", error);
        throw error;
    }
};

// 🔹 Función para crear un nuevo usuario
export const createUser = async (name, email, password) => {
    try {
        console.log("🛠 Creando nuevo usuario en PostgreSQL...");
        const { rows } = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password]
        );
        return rows[0];
    } catch (error) {
        console.error("❌ Error en createUser:", error);
        throw error;
    }
};
