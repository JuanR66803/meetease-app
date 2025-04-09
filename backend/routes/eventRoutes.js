import express from "express";
import { registerEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/registerEvent", registerEvent);

export default router;
