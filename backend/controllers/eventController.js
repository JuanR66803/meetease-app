import { createEvent } from "../models/eventModel.js";

export const registerEvent = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de creación de evento:", req.body);

        const {
            title,
            date,
            time,
            description,
            location,
            venue,          // se pasa como location_name
            address,
            lat,
            lng,
            price,
            capacity,
            image_url,
            type_event,
            id_organizer
        } = req.body;

        // Validación básica
        if (!title || !date || !location || !lat || !lng || !price || !capacity || !type_event || !venue || !address || !time || !description || !id_organizer) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        // Crear evento
        const newEvent = await createEvent(
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
            venue,       // ← location_name
            address,
            time,
            description
        );

        console.log("✅ Evento creado:", newEvent);

        res.status(201).json({ message: "Evento creado con éxito", event: newEvent });
    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
