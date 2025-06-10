import express from "express";
import { createTicket } from "../controllers/ticketController.js";


const router = express.Router();

router.post("/generateTicket", createTicket);


export default router;


