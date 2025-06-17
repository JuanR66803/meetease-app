import { GenerarTicket, FindTicket } from "../models/TicketsModel.js";


export const createTicket = async (req, res) => {
    try {
        console.log("Recibiendo solicitud de creación de ticket:", req.body);
        const { id_event, id_user, type_tickets, qr_code, reserve_status, cant_entradas } = req.body;

        console.log("numentradas (valor recibido):", cant_entradas);
        console.log("Tipo de numentradas:", typeof cant_entradas);
        if (!id_event || !id_user || !type_tickets || !qr_code || !reserve_status || !cant_entradas) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const newTicket = await GenerarTicket(id_event, id_user, type_tickets, qr_code, reserve_status, cant_entradas);
        console.log("Evento creado:", newTicket);
        res.status(201).json({ message: "Evento creado con éxito", ticket: newTicket });


    } catch (error) {
        console.error("❌ Error al crear ticket:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const FindTicketsUser = async (req, res) => {
    const { id_user, status} = req.body;
    console.log("Id usuario ticket: ", id_user);

    if (!id_user || !status) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    try {
        const tickets = await FindTicket(id_user,status);
        return res.status(200).json({
            message: "Tickets encontrados.",
            data: tickets,
        });
    } catch (error) {
        console.error("❌ Error al buscar tickets:", error);
        return res.status(500).json({ message: "Error del servidor." });
    }
};

