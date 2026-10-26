import { iniciarComun, linkWhatsApp, alScrollear } from './comun.js';

iniciarComun();

const TITULO = '«La empresa que construimos, la familia que somos»';
const MENSAJE_COMPRA = `Hola Florencia, quiero comprar el ebook ${TITULO}. ¿Cómo hago para conseguir la contraseña?`;
const CLAVE_SESION = 'ebook-acceso';

document.querySelectorAll('[data-wa-compra]').forEach((a) => { a.href = linkWhatsApp(MENSAJE_COMPRA); });
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = linkWhatsApp(a.dataset.wa); });

// ---------- Línea de pasos que se completa con el scroll ----------
const marcoPasos = document.querySelector('[data-pasos]');
const lineaPasos = document.querySelector('[data-pasos-linea]');
const pasos = [...document.querySelectorAll('[data-paso]')];
if (marcoPasos && lineaPasos) {
  alScrollear(marcoPasos, (p) => {
    lineaPasos.style.setProperty('--p', p.toFixed(3));
    pasos.forEach((paso, i) => paso.classList.toggle('is-alcanzado', p >= i / Math.max(1, pasos.length - 1) - 0.02));
  }, { inicio: 0.8, fin: 0.55 });
}

// ---------- Pop-up de acceso ----------
const dialogo = document.getElementById('acceso');
const form = dialogo.querySelector('[data-form-acceso]');
const input = dialogo.querySelector('#password-ebook');
const botonVer = dialogo.querySelector('[data-ver-password]');
const error = dialogo.querySelector('[data-error-acceso]');
const errorTexto = dialogo.querySelector('[data-error-texto]');
const botonEnviar = dialogo.querySelector('[data-enviar-acceso]');
const textoEnviar = dialogo.querySelector('[data-enviar-texto]');
const pasoForm = dialogo.querySelector('[data-paso-form]');
const pasoListo = dialogo.querySelector('[data-paso-listo]');
const tituloListo = dialogo.querySelector('[data-titulo-listo]');
const notaListo = dialogo.querySelector('[data-nota-listo]');
const pieAcceso = dialogo.querySelector('[data-pie-acceso]');
const botonDescargar = dialogo.querySelector('[data-descargar]');
const botonLeer = dialogo.querySelector('[data-leer]');

// La contraseña se guarda solo en esta pestaña para pedir un enlace nuevo en cada descarga.
const sesion = {
  leer() { try { return sessionStorage.getItem(CLAVE_SESION); } catch { return null; } },
  guardar(v) { try { sessionStorage.setItem(CLAVE_SESION, v); } catch { /* sin almacenamiento: se usa memoria */ } },
  borrar() { try { sessionStorage.removeItem(CLAVE_SESION); } catch { /* nada */ } },
};
let passwordActual = sesion.leer();

function mostrarError(mensaje) {
  errorTexto.textContent = mensaje;
  error.hidden = false;
  input.setAttribute('aria-invalid', 'true');
  form.classList.remove('tiembla');
  void form.offsetWidth;
  form.classList.add('tiembla');
}

function limpiarError() {
  error.hidden = true;
  input.removeAttribute('aria-invalid');
}

function mostrarListo() {
  pasoForm.hidden = true;
  pasoListo.hidden = false;
  pieAcceso.hidden = true;
  tituloListo.focus();
}

function mostrarFormulario() {
  pasoForm.hidden = false;
  pasoListo.hidden = true;
  pieAcceso.hidden = false;
}

function abrir() {
  if (passwordActual) mostrarListo(); else mostrarFormulario();
  dialogo.showModal();
  if (!passwordActual) setTimeout(() => input.focus(), 60);
}

document.querySelectorAll('[data-abrir-acceso]').forEach((b) => b.addEventListener('click', (e) => {
  e.preventDefault();
  abrir();
}));
dialogo.querySelector('[data-cerrar-acceso]').addEventListener('click', () => dialogo.close());
// Cerrar tocando fuera de la tarjeta
dialogo.addEventListener('click', (e) => {
  if (e.target !== dialogo) return;
  const r = dialogo.getBoundingClientRect();
  const fuera = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (fuera) dialogo.close();
});
if (location.hash === '#acceso') abrir();

botonVer.addEventListener('click', () => {
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  botonVer.setAttribute('aria-pressed', String(!visible));
  botonVer.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
  botonVer.querySelector('i').className = visible ? 'ph ph-eye' : 'ph ph-eye-slash';
  input.focus();
});
input.addEventListener('input', limpiarError);

async function pedirEnlace(password) {
  const respuesta = await fetch('/api/ebook/acceso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (respuesta.ok) return respuesta.json();
  const datos = await respuesta.json().catch(() => ({}));
  const fallo = new Error(datos.error || 'red');
  fallo.codigo = datos.error || (respuesta.status === 401 ? 'incorrecta' : 'red');
  throw fallo;
}

const MENSAJES = {
  incorrecta: 'Esa contraseña no es correcta. Copiala completa desde WhatsApp, sin espacios de más, y pegala de nuevo.',
  vacia: 'Pegá la contraseña que te enviamos por WhatsApp.',
  config: 'La descarga no está disponible en este momento. Escribinos por WhatsApp y te lo enviamos.',
  red: 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.',
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = input.value.trim();
  if (!password) { mostrarError(MENSAJES.vacia); input.focus(); return; }

  botonEnviar.setAttribute('aria-busy', 'true');
  botonEnviar.disabled = true;
  textoEnviar.textContent = 'Verificando…';
  try {
    await pedirEnlace(password);
    passwordActual = password;
    sesion.guardar(password);
    limpiarError();
    input.value = '';
    mostrarListo();
  } catch (err) {
    mostrarError(MENSAJES[err.codigo] || MENSAJES.red);
    input.select();
  } finally {
    botonEnviar.removeAttribute('aria-busy');
    botonEnviar.disabled = false;
    textoEnviar.textContent = 'Ingresar';
  }
});

// Cada clic pide un enlace nuevo: el comprador nunca se topa con uno vencido.
async function conEnlaceNuevo(boton, usar) {
  const etiqueta = boton.querySelector('span');
  const original = etiqueta?.textContent;
  boton.setAttribute('aria-busy', 'true');
  boton.disabled = true;
  if (etiqueta) etiqueta.textContent = 'Preparando…';
  try {
    const enlaces = await pedirEnlace(passwordActual);
    usar(enlaces);
    notaListo.textContent = 'Si la descarga no arranca, tocá el botón otra vez: cada vez se genera un enlace nuevo.';
    return true;
  } catch (err) {
    if (err.codigo === 'incorrecta') {
      // Florencia cambió la contraseña: hay que ingresar la nueva.
      passwordActual = null;
      sesion.borrar();
      mostrarFormulario();
      mostrarError('La contraseña cambió. Pedí la nueva por WhatsApp y pegala acá.');
      input.focus();
      return null;
    }
    notaListo.textContent = MENSAJES[err.codigo] || MENSAJES.red;
    return null;
  } finally {
    boton.removeAttribute('aria-busy');
    boton.disabled = false;
    if (etiqueta) etiqueta.textContent = original;
  }
}

botonDescargar.addEventListener('click', () => conEnlaceNuevo(botonDescargar, ({ descargar }) => {
  window.location.href = descargar;
}));

botonLeer.addEventListener('click', () => {
  // La pestaña se abre en el mismo clic para que el navegador no la bloquee.
  const pestana = window.open('', '_blank');
  conEnlaceNuevo(botonLeer, ({ leer }) => {
    if (pestana) pestana.location.href = leer; else window.location.href = leer;
  }).then((ok) => { if (!ok && pestana) pestana.close(); });
});
