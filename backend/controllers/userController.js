import { updateUserById } from "../models/userModel.js";

export const updateUserController = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario
        const { name, cel, image_url } = req.body;

        console.log("🛠 Actualizando usuario:", { id, name, cel, image_url });

        const updatedUser = await updateUserById(id, name, cel, image_url);

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
        console.error("❌ Error en updateUserController:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

