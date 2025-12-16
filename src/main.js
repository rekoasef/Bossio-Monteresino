document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-brand-black/95', 'shadow-md', 'py-3');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.add('bg-transparent', 'py-5');
      navbar.classList.remove('bg-brand-black/95', 'shadow-md', 'py-3');
    }
  };
  window.addEventListener('scroll', handleScroll);

  // --- 2. Mobile Menu Logic ---
  const btnOpen = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-link');

  btnOpen.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Animación simple de entrada
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('animate-fade-in');
    }
  });

  // Cerrar menú al hacer click en un link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // --- 3. Intersection Observer (Scroll Animations) ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Disparar cuando el 15% del elemento es visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Dejar de observar una vez animado
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.reveal-element, .reveal-left, .reveal-right');
  elements.forEach(el => observer.observe(el));

  // --- 4. Form Handling Placeholder ---
  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.innerText;
      
      btn.innerText = 'Enviando...';
      btn.disabled = true;
      btn.classList.add('opacity-75');

      // Simulación de envío
      setTimeout(() => {
        alert('Gracias por su mensaje. Nos pondremos en contacto a la brevedad.');
        contactForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75');
      }, 1500);
    });
  }
});