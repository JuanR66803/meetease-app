// controllers/paymentController.js
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Importar funciones necesarias
import { 
    UpdateTicketReserveStatus, 
    GetReservedTicketById 
} from '../models/TicketsModel.js';

import { InsertPaymentRecord } from '../models/payModel.js';

// ✅ Usa importación nombrada, no default
import { findEventById } from '../models/eventModel.js';

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE_URL = process.env.PAYPAL_API_BASE_URL;
const COP_TO_USD_EXCHANGE_RATE = parseFloat(process.env.COP_TO_USD_EXCHANGE_RATE);

// ---------------------------------------------
// Generar token de acceso para API de PayPal
// ---------------------------------------------
async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

    const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const data = await response.json();
    return data.access_token;
}

// ---------------------------------------------
// Crear orden de PayPal
// ---------------------------------------------
export const createPaypalOrder = async (req, res) => {
    try {
        const { id_ticket, description } = req.body;

        const ticket = await GetReservedTicketById(id_ticket);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado o no está en estado 'reservado'." });
        }

        const event = await findEventById(ticket.id_event);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado." });
        }

        const totalAmountCOP = event.price * ticket.cant_entradas;
        const totalAmountUSD = (totalAmountCOP * COP_TO_USD_EXCHANGE_RATE).toFixed(2);

        const accessToken = await generateAccessToken();

        const orderResponse = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: totalAmountUSD,
                        },
                        description: description,
                        custom_id: id_ticket.toString(),
                    },
                ],
                application_context: {
                    return_url: `${process.env.FRONTEND_ORIGIN}/user/mis-tickets?payment=success`,
                    cancel_url: `${process.env.FRONTEND_ORIGIN}/user/mis-tickets?payment=cancel`,
                    user_action: 'PAY_NOW'
                },
            }),
        });

        const orderData = await orderResponse.json();

        if (orderResponse.ok) {
            res.status(201).json(orderData);
        } else {
            console.error("Error creando orden:", orderData);
            res.status(orderResponse.status).json({ message: "Error al crear la orden", details: orderData });
        }

    } catch (error) {
        console.error("Error en createPaypalOrder:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

// ---------------------------------------------
// Capturar pago de PayPal
// ---------------------------------------------
export const capturePaypalOrder = async (req, res) => {
    try {
        const { orderID, ticketDetails } = req.body;

        if (!orderID || !ticketDetails?.id_tickets) {
            return res.status(400).json({ message: "Order ID y ticket son requeridos." });
        }

        const accessToken = await generateAccessToken();

        const captureResponse = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const captureData = await captureResponse.json();

        if (captureResponse.ok) {
            const paypalTransactionId = captureData.purchase_units[0].payments.captures[0].id;
            const paymentStatus = captureData.status;
            const paymentAmountUsd = captureData.purchase_units[0].payments.captures[0].amount.value;

            const newPayment = await InsertPaymentRecord(
                ticketDetails.id_tickets,
                'PayPal',
                parseFloat(paymentAmountUsd),
                paymentStatus,
                orderID,
                paypalTransactionId
            );

            const updatedTicket = await UpdateTicketReserveStatus(
                ticketDetails.id_tickets,
                'confirmado'
            );

            console.log("Pago confirmado:", newPayment);
            res.status(200).json(captureData);
        } else {
            console.error("Error al capturar pago:", captureData);

            const failedPayment = await InsertPaymentRecord(
                ticketDetails.id_tickets,
                'PayPal',
                0,
                captureData.status || 'FAILED',
                orderID,
                null
            );

            res.status(captureResponse.status).json({ message: "Error al capturar", details: captureData });
        }

    } catch (error) {
        console.error("Error en capturePaypalOrder:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};
