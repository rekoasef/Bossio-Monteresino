// GET /api/ebook/descargar?t=<token>[&ver=1]
// Entrega el PDF guardado en /private solo si el link firmado sigue vigente.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { NOMBRE_ARCHIVO, verificarToken } from '../_lib/ebook.js';

const RUTA_PDF = join(process.cwd(), 'private', 'ebook.pdf');

function paginaError(res, estado, titulo, texto) {
  res.statusCode = estado;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#121110;color:#f2eee9;font:17px/1.6 system-ui,sans-serif;padding:24px}main{max-width:30rem}h1{font-family:Georgia,serif;font-weight:600;font-size:1.75rem;margin:0 0 .5rem}a{display:inline-block;margin-top:1.25rem;background:#F39C4F;color:#1A1A1A;font-weight:700;text-decoration:none;padding:.8rem 1.4rem;border-radius:6px}</style></head>
<body><main><h1>${titulo}</h1><p>${texto}</p><a href="/ebook">Volver a la página del ebook</a></main></body></html>`);
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const token = req.query?.t ?? url.searchParams.get('t');
  const ver = (req.query?.ver ?? url.searchParams.get('ver')) === '1';

  const estado = verificarToken(token);
  if (estado === 'vencido') {
    return paginaError(res, 410, 'Este enlace ya venció',
      'Por seguridad, cada enlace de descarga dura unos minutos. Volvé a la página del ebook, tocá «Descargar» y se genera uno nuevo con tu contraseña.');
  }
  if (estado !== 'ok') {
    return paginaError(res, 403, 'Enlace no válido',
      'Para descargar el ebook ingresá la contraseña que te enviamos por WhatsApp en la página del ebook.');
  }

  let info;
  try {
    info = await stat(RUTA_PDF);
  } catch {
    return paginaError(res, 500, 'No pudimos encontrar el archivo',
      'Escribinos por WhatsApp y te lo enviamos enseguida.');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', info.size);
  res.setHeader('Content-Disposition', `${ver ? 'inline' : 'attachment'}; filename="${NOMBRE_ARCHIVO}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  createReadStream(RUTA_PDF).pipe(res);
}
