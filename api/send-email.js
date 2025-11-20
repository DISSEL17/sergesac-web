// Importar la librería Resend
import { Resend } from 'resend';

// Esta línea es mágica: Vercel convierte esto en una Función Serverless
export default async function handler(req, res) {

  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Obtener los datos del formulario (enviados desde tu js/main.js)
  const { nombre, email, telefono, mensaje } = req.body;

  // Obtener la API Key y el email de destino desde Vercel
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;

  if (!apiKey || !toEmail) {
    return res.status(500).json({ error: 'Variables de entorno no configuradas.' });
  }

  const resend = new Resend(apiKey);

  try {
    // Enviar el email
    await resend.emails.send({
      from: 'Contacto Web <onboarding@resend.dev>', // Email de Resend (para pruebas)
      to: [toEmail], // Tu email (configurado en Vercel)
      subject: `Nuevo Contacto de DECOR.IN - ${nombre}`,
      html: `
        <h1>Nuevo Mensaje de Contacto</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    // Enviar respuesta de éxito al frontend
    res.status(200).json({ message: '¡Mensaje enviado con éxito!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar el email.' });
  }
}