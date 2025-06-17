// routes/paymentRoutes.js
import express from 'express';
import { createPaypalOrder, capturePaypalOrder } from '../controllers/paymentController.js';

const router = express.Router();

// Ruta para crear una orden de pago en PayPal
// El frontend (React) llamará a esta ruta cuando el usuario inicie el proceso de pago
router.post('/paypal/create-order', createPaypalOrder);

// Ruta para capturar el pago en PayPal
// El frontend (React) llamará a esta ruta después de que el usuario apruebe la transacción en PayPal
router.post('/paypal/capture-order', capturePaypalOrder);

export default router;