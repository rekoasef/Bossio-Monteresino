// Lógica compartida del acceso al ebook.
// Los archivos de /api que empiezan con "_" no se publican como endpoints en Vercel.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Cuánto dura un link de descarga. La página pide uno nuevo en cada clic,
// así que el comprador nunca se encuentra con uno vencido.
export const VIGENCIA_MS = 10 * 60 * 1000;

export const NOMBRE_ARCHIVO = 'La-empresa-que-construimos-la-familia-que-somos.pdf';

function sha256(texto) {
  return createHash('sha256').update(texto, 'utf8').digest();
}

function secreto() {
  const s = process.env.EBOOK_SECRET || process.env.EBOOK_PASSWORD;
  if (!s) throw new Error('Falta la variable EBOOK_PASSWORD');
  return s;
}

export function estaConfigurado() {
  return Boolean(process.env.EBOOK_PASSWORD);
}

export function passwordCorrecta(intento) {
  const real = process.env.EBOOK_PASSWORD;
  if (!real || typeof intento !== 'string' || intento.length > 200) return false;
  // Comparamos hashes de igual largo para que el tiempo de respuesta no revele nada.
  return timingSafeEqual(sha256(intento.trim()), sha256(real.trim()));
}

function firmar(exp) {
  return createHmac('sha256', secreto()).update(`ebook:${exp}`).digest('base64url');
}

export function crearToken(ahora = Date.now()) {
  const exp = String(ahora + VIGENCIA_MS);
  return { token: `${exp}.${firmar(exp)}`, exp: Number(exp) };
}

export function verificarToken(token, ahora = Date.now()) {
  if (typeof token !== 'string') return 'invalido';
  const [exp, firma] = token.split('.');
  if (!exp || !firma || !/^\d{10,16}$/.test(exp)) return 'invalido';
  const esperada = Buffer.from(firmar(exp));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return 'invalido';
  if (Number(exp) < ahora) return 'vencido';
  return 'ok';
}

export async function leerJson(req) {
  // En Vercel req.body ya viene parseado; en desarrollo local lo leemos a mano.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  let crudo = '';
  for await (const parte of req) {
    crudo += parte;
    if (crudo.length > 10_000) break;
  }
  try { return JSON.parse(crudo || '{}'); } catch { return {}; }
}

export function responderJson(res, estado, datos) {
  res.statusCode = estado;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(datos));
}
