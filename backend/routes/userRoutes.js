import express from "express";
import { updateUserController } from "../controllers/userController.js";

const router = express.Router();
// Ahora usamos ID y no email en la ruta
router.put("/update/:id", updateUserController);


export default router;
