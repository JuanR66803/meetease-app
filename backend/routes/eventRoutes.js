import express from "express";
import multer from "multer";
import { registerEvent } from "../controllers/eventController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Para manejar la imagen en memoria

// Ruta para registrar un evento con imagen opcional
router.post("/registerEvent", upload.single("image"), registerEvent);

export default router;
