import { iniciarComun, linkWhatsApp, alScrollear } from './comun.js';

iniciarComun();

// ---------- Libro fijo: la hoja visible acompaña la clave que se está leyendo ----------
const hojas = [...document.querySelectorAll('[data-hoja]')];
const claves = [...document.querySelectorAll('[data-clave]')];
const contador = document.querySelector('[data-contador]');
const riel = document.querySelector('[data-riel]');
const listaClaves = document.querySelector('[data-lista-claves]');

function mostrarHoja(indice) {
  hojas.forEach((hoja, i) => {
    hoja.classList.toggle('is-pasada', i < indice);
    hoja.classList.toggle('is-siguiente', i > indice);
    hoja.style.zIndex = String(hojas.length - i);
  });
  claves.forEach((c, i) => c.classList.toggle('is-activa', i === indice));
  if (contador) contador.textContent = String(indice + 1).padStart(2, '0');
}

if (hojas.length && claves.length) {
  mostrarHoja(0);
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) mostrarHoja(Number(e.target.dataset.clave));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  claves.forEach((c) => obs.observe(c));

  if (riel && listaClaves) {
    alScrollear(listaClaves, (p) => riel.style.setProperty('--p', p.toFixed(3)), { inicio: 0.5, fin: 0.5 });
  }
}

// ---------- Autodiagnóstico ----------
const casillas = [...document.querySelectorAll('[data-pregunta]')];
const cuenta = document.querySelector('[data-cuenta]');
const titulo = document.querySelector('[data-resultado-titulo]');
const texto = document.querySelector('[data-resultado-texto]');
const botonWa = document.querySelector('[data-wa-diagnostico]');

const MENSAJE_BASE = 'Hola Florencia, vi la guía «El campo también necesita acuerdos» y me gustaría coordinar una consulta.';

function actualizarDiagnostico(animar = true) {
  const marcadas = casillas.filter((c) => c.checked);
  const n = marcadas.length;
  if (cuenta) {
    cuenta.textContent = String(n);
    if (animar) {
      cuenta.classList.remove('is-salta');
      void cuenta.offsetWidth;
      cuenta.classList.add('is-salta');
    }
  }
  if (titulo && texto) {
    if (n === 0) {
      titulo.textContent = 'Situaciones marcadas';
      texto.textContent = 'Tocá las preguntas en las que reconozcas a tu empresa. No es un puntaje: es un punto de partida para conversar.';
    } else if (n === 1) {
      titulo.textContent = 'Situación para conversar';
      texto.textContent = 'Ya tenés un tema concreto. La guía explica qué conviene revisar y qué documentos reunir.';
    } else {
      titulo.textContent = 'Situaciones para conversar';
      texto.textContent = 'La guía sugiere elegir dos de estas respuestas «Sí» y empezar por ahí: en familia o en una consulta.';
    }
  }
  if (botonWa) {
    const mensaje = n
      ? `${MENSAJE_BASE}\n\nEn el autodiagnóstico me identifiqué con:\n${marcadas.map((c) => `• ${c.dataset.pregunta}`).join('\n')}`
      : MENSAJE_BASE;
    botonWa.href = linkWhatsApp(mensaje);
  }
}

casillas.forEach((c) => c.addEventListener('change', () => actualizarDiagnostico()));
actualizarDiagnostico(false);

// Links de WhatsApp con mensaje armado
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = linkWhatsApp(a.dataset.wa || MENSAJE_BASE);
});
