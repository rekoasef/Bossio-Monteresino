// Comportamiento compartido por /guia y /ebook.
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';

export const WHATSAPP = '5493476616820';
export const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function linkWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

function navegacion() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  const flotante = document.querySelector('.flotante-wa');
  const actualizar = () => {
    nav.classList.toggle('is-solida', window.scrollY > 40);
    // El botón flotante aparece después del hero, para no tapar sus botones.
    flotante?.classList.toggle('is-oculto', window.scrollY < window.innerHeight * 0.6);
  };
  actualizar();
  window.addEventListener('scroll', actualizar, { passive: true });

  const boton = nav.querySelector('[data-menu-btn]');
  const menu = nav.querySelector('[data-menu]');
  if (!boton || !menu) return;
  const cerrar = () => {
    menu.hidden = true;
    boton.setAttribute('aria-expanded', 'false');
    boton.querySelector('i').className = 'ph ph-list';
  };
  boton.addEventListener('click', () => {
    const abrir = menu.hidden;
    menu.hidden = !abrir;
    boton.setAttribute('aria-expanded', String(abrir));
    boton.querySelector('i').className = abrir ? 'ph ph-x' : 'ph ph-list';
    if (abrir) nav.classList.add('is-solida');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
}

function revelados() {
  const elementos = document.querySelectorAll('.revela');
  if (!('IntersectionObserver' in window) || reduceMovimiento) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  elementos.forEach((el) => obs.observe(el));
}

// Parallax suave de fotos de fondo e inclinación del libro con el mouse.
function parallax() {
  if (reduceMovimiento) return;
  const capas = [...document.querySelectorAll('[data-parallax]')];
  if (capas.length) {
    let pendiente = false;
    const mover = () => {
      pendiente = false;
      capas.forEach((capa) => {
        const caja = capa.parentElement.getBoundingClientRect();
        if (caja.bottom < 0 || caja.top > innerHeight) return;
        const factor = Number(capa.dataset.parallax) || 0.2;
        capa.style.transform = `translate3d(0, ${(-caja.top * factor).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener('scroll', () => {
      if (!pendiente) { pendiente = true; requestAnimationFrame(mover); }
    }, { passive: true });
    mover();
  }

  const libro = document.querySelector('[data-libro-tilt]');
  if (libro && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cuerpo = libro.querySelector('.libro__cuerpo');
    const zona = libro.closest('section') || document.body;
    zona.addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      cuerpo.style.transform = `rotateY(${(-24 + x * 14).toFixed(2)}deg) rotateX(${(6 - y * 8).toFixed(2)}deg) rotateZ(1deg)`;
    });
    zona.addEventListener('pointerleave', () => { cuerpo.style.transform = ''; });
  }
}

// Progreso (0 a 1) de un elemento a medida que cruza la pantalla.
export function alScrollear(elemento, callback, { inicio = 0.85, fin = 0.35 } = {}) {
  let pendiente = false;
  const calcular = () => {
    pendiente = false;
    const caja = elemento.getBoundingClientRect();
    const desde = innerHeight * inicio;
    const hasta = innerHeight * fin - caja.height;
    const p = (desde - caja.top) / (desde - hasta);
    callback(Math.min(1, Math.max(0, p)));
  };
  window.addEventListener('scroll', () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); }
  }, { passive: true });
  window.addEventListener('resize', calcular);
  calcular();
}

// Frase que se ilumina palabra por palabra al hacer scroll.
function frasesPorPalabra() {
  document.querySelectorAll('[data-palabras]').forEach((frase) => {
    const acentos = (frase.dataset.acento || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    const palabras = frase.textContent.trim().split(/\s+/);
    frase.setAttribute('aria-label', frase.textContent.trim());
    frase.innerHTML = palabras
      .map((p) => {
        const limpia = p.toLowerCase().replace(/[.,;:]/g, '');
        return `<span class="palabra${acentos.includes(limpia) ? ' acento' : ''}" aria-hidden="true">${p}</span>`;
      })
      .join(' ');
    if (reduceMovimiento) return;
    const spans = [...frase.querySelectorAll('.palabra')];
    alScrollear(frase, (p) => {
      const n = spans.length;
      spans.forEach((s, i) => {
        const local = Math.min(1, Math.max(0, p * (n + 3) - i));
        s.style.setProperty('--o', (0.16 + local * 0.84).toFixed(3));
      });
    }, { inicio: 0.9, fin: 0.45 });
  });
}

export function iniciarComun() {
  document.documentElement.classList.remove('sin-js');
  navegacion();
  frasesPorPalabra();
  revelados();
  parallax();
}
