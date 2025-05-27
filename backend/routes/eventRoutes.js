import express from "express";
import { registerEvent, getEventFeed } from "../controllers/eventController.js";

const router = express.Router();

router.post("/registerEvent", registerEvent);
router.get("/feed", getEventFeed); // <--- ESTA LÍNEA ES CLAVE

export default router;
