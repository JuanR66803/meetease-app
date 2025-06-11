import mercadopago from '../config/mercadoPago.js';

export const createPreference = async (req, res) => {
  try {
    const { title, quantity, unit_price } = req.body;

    // Validación básica
    if (!title || !quantity || !unit_price) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const preference = {
      items: [
        {
          title,
          quantity: Number(quantity),
          unit_price: Number(unit_price),
          currency_id: 'COP'
        }
      ],
      back_urls: {
        success: 'https://tu-app.vercel.app/success',
        failure: 'https://tu-app.vercel.app/failure',
        pending: 'https://tu-app.vercel.app/pending'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ id: response.body.id });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ message: 'Error al crear la preferencia de pago' });
  }
};
