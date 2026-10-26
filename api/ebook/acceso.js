// POST /api/ebook/acceso  { password }
// Si la contraseña es correcta devuelve un link de descarga firmado que vence en minutos.
import { crearToken, estaConfigurado, leerJson, passwordCorrecta, responderJson } from '../_lib/ebook.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return responderJson(res, 405, { error: 'metodo' });
  }

  if (!estaConfigurado()) {
    return responderJson(res, 503, { error: 'config' });
  }

  const { password } = await leerJson(req);

  if (!passwordCorrecta(password)) {
    // Una pequeña demora hace impráctico probar contraseñas en masa.
    await esperar(700);
    return responderJson(res, 401, { error: 'incorrecta' });
  }

  const { token, exp } = crearToken();
  return responderJson(res, 200, {
    descargar: `/api/ebook/descargar?t=${encodeURIComponent(token)}`,
    leer: `/api/ebook/descargar?t=${encodeURIComponent(token)}&ver=1`,
    vence: exp,
  });
}
