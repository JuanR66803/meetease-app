import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";

const router = express.Router(); // ✅ Define el enrutador antes de usarlo

// Rutas de autenticación
router.post("/register", registerUser);
router.post("/login", loginUser)

// Ruta de prueba
router.get("/test", (req, res) => {
    res.json({ message: "El servidor está funcionando correctamente" });
});

export default router; // ✅ Exporta el router correctamente
