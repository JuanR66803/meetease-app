import { createEvent } from "../models/eventModel.js";
import multer from "multer";

// Configurar almacenamiento de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const registerEvent = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de creación de evento:", req.body);

        const { title, date, location, lat, lng, price, capacity } = req.body;
        const image = req.file;

        // Validación de campos obligatorios
        if (!title || !date || !location || !lat || !lng || !price || !capacity) {
            return res.status(400).json({ message: "Faltan campos obligatorios: título, fecha, ubicación, lat, lng, precio o capacidad." });
        }

        // Convertir imagen a base64 (opcional)
        const imageUrl = image 
            ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
            : null;

        // Pasar todos los campos, incluyendo lat/lng
        const newEvent = await createEvent(title, date, location, lat, lng, price, capacity, imageUrl);

        console.log("✅ Evento creado:", newEvent);

        res.status(201).json({ message: "Evento creado con éxito", event: newEvent });

    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
