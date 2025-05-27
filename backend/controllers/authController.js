import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, createGoogleUser, updateExistingUserWithGoogle } from "../models/userModel.js";

// Controlador para registro normal
export const registerUser = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de registro:", req.body);
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            console.warn("⚠️ Datos incompletos:", { name, email, password });
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }
        
        const userExists = await findUserByEmail(email);
        console.log("🔍 Usuario encontrado:", userExists);
        
        if (userExists) {
            console.warn("❌ El usuario ya está registrado:", email);
            return res.status(400).json({ message: "El usuario ya está registrado." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Contraseña hasheada correctamente");
        
        const newUser = await createUser(name, email, hashedPassword);
        console.log("✅ Usuario registrado con éxito:", newUser);
        
        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

// Controlador específico para registro con Google
export const registerGoogleUser = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de registro con Google:", req.body);
        const { name, email, password, image_url } = req.body;
        
        if (!name || !email || !password) {
            console.warn("⚠️ Datos incompletos:", { name, email, password });
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }
        
        // Verificar si el usuario ya existe
        const userExists = await findUserByEmail(email);
        console.log("🔍 Usuario encontrado:", userExists);
        
        // Si el usuario ya existe, actualizamos sus datos con la información de Google
        if (userExists) {
            const updatedUser = await updateExistingUserWithGoogle(
                userExists.id_user, 
                name, 
                image_url
            );
            
            console.log("🔄 Usuario existente actualizado con datos de Google:", updatedUser);
            return res.status(200).json({ 
                message: "Inicio de sesión exitoso con Google", 
                user: updatedUser 
            });
        }
        
        // Si el usuario no existe, lo creamos con la información de Google
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Contraseña aleatoria hasheada correctamente");
        
        const newUser = await createGoogleUser(name, email, hashedPassword, image_url);
        console.log("✅ Usuario de Google registrado con éxito:", newUser);
        
        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("❌ Error al registrar usuario con Google:", error);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("🔑 Recibiendo solicitud de inicio de sesión:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.warn("⚠️ Datos incompletos:", { email, password });
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const user = await findUserByEmail(email);
        console.log("🔍 Usuario encontrado:", user);

        if (!user) {
            console.warn("❌ Usuario no encontrado:", email);
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("🔑 Comparación de contraseña:", passwordMatch);

        if (!passwordMatch) {
            console.warn("❌ Contraseña incorrecta para:", email);
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("✅ Token generado:", token);

        res.status(200).json({ message: "Inicio de sesión exitoso", token, user });

    } catch (error) {
        console.error("❌ Error en el inicio de sesión:", error);

        res.status(500).json({ 
            message: "Error en el servidor",
            error: error.message, 
            stack: error.stack 
        });
    }
};
