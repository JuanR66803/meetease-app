import { createEvent, findEventFeed } from "../models/eventModel.js";

export const registerEvent = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de creación de evento:", req.body);

        const {
            title,
            date,
            time,
            description,
            location,
            location_name,          
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
        if (!title || !date || !location || !lat || !lng || !price || !capacity || !type_event || !location_name || !address || !time || !description || !id_organizer) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        // Crear evento
        const newEvent = await createEvent(
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
            location_name, // <--- corregido aquí
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

export const getEventFeed = async (req, res) => {
    try {
        const events = await findEventFeed();
        res.status(200).json(events); // <-- Debe devolver un array
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
