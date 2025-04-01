import { createEvent } from "../models/eventModel.js";
import multer from "multer";

// Configurar almacenamiento de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const registerEvent = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de creación de evento:", req.body);

        const { title, date, location, price, capacity } = req.body;
        const image = req.file;

        // ✅ Ahora la imagen es opcional
        if (!title || !date || !location || !price || !capacity) {
            return res.status(400).json({ message: "Los campos obligatorios son: título, fecha, ubicación, precio y capacidad." });
        }

        const imageUrl = image 
            ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
            : null;

        // ❗ Corrección: `createEvent` recibe parámetros individuales, no un objeto
        const newEvent = await createEvent(title, date, location, price, capacity, imageUrl);
        
        console.log("✅ Evento creado:", newEvent);

        res.status(201).json({ message: "Evento creado con éxito", event: newEvent });

    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
