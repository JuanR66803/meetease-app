import express from "express";
import { createTicket, FindTicketsUser } from "../controllers/ticketController.js";


const router = express.Router();

router.post("/generateTicket", createTicket);
router.post("/findTickets", FindTicketsUser);


export default router;


