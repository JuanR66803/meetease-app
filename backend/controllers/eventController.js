import { createEvent } from "../models/eventModel.js";

export const registerEvent = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de creación de evento:", req.body);

        const { title, date, location, lat, lng, price, capacity, image_url, type_event } = req.body;

        if (!title || !date || !location || !lat || !lng || !price || !capacity || !type_event) {
            return res.status(400).json({ message: "Faltan campos obligatorios: título, fecha, ubicación, precio, capacidad o tipo." });
        }

        const newEvent = await createEvent(title, date, location, lat, lng, price, capacity, image_url, type_event);

        console.log("✅ Evento creado:", newEvent);

        res.status(201).json({ message: "Evento creado con éxito", event: newEvent });
    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
