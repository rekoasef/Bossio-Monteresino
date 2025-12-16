document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Cargado correctamente");

  // --- 1. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-brand-black/95', 'shadow-md', 'py-3');
        navbar.classList.remove('bg-transparent', 'py-4');
      } else {
        navbar.classList.add('bg-transparent', 'py-4');
        navbar.classList.remove('bg-brand-black/95', 'shadow-md', 'py-3');
      }
    });
  }

  // --- 2. Mobile Menu Logic ---
  const btnOpen = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-link');

  if (btnOpen && mobileMenu) {
    btnOpen.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('animate-fade-in');
      }
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- 3. Intersection Observer (Animaciones) ---
  const elements = document.querySelectorAll('.reveal-element, .reveal-left, .reveal-right');
  if (elements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  // --- 4. WIZARD FORM LOGIC (Reserva de Turnos) ---
  const wizardForm = document.getElementById('wizard-form');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const submitBtn = document.getElementById('submit-btn');

  // Solo ejecutamos esto si el formulario y los botones existen
  if (wizardForm && nextBtn && prevBtn && submitBtn) {
    console.log("Wizard Form detectado e inicializado");
    
    let currentStep = 1;
    const totalSteps = 3;

    // Elementos de Pasos
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    // Elementos de Dots (Indicadores)
    const dot1 = document.getElementById('step-dot-1');
    const dot2 = document.getElementById('step-dot-2');
    const dot3 = document.getElementById('step-dot-3');

    // Función para actualizar la vista
    function updateWizard() {
      // 1. Ocultar todos los pasos
      step1.classList.add('hidden');
      step2.classList.add('hidden');
      step3.classList.add('hidden');

      // 2. Mostrar paso actual
      if (currentStep === 1) step1.classList.remove('hidden');
      if (currentStep === 2) step2.classList.remove('hidden');
      if (currentStep === 3) step3.classList.remove('hidden');

      // 3. Controlar Botones
      if (currentStep === 1) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
      } else if (currentStep === totalSteps) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
      } else {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
      }

      // 4. Actualizar Dots (Estilos)
      updateDots();
    }

    function updateDots() {
      // Resetear estilos
      [dot1, dot2, dot3].forEach(d => {
        if(d) {
            d.classList.remove('bg-brand-orange', 'text-white');
            d.classList.add('bg-gray-200', 'text-gray-500');
        }
      });

      // Activar actuales
      if (dot1 && currentStep >= 1) {
        dot1.classList.add('bg-brand-orange', 'text-white');
        dot1.classList.remove('bg-gray-200', 'text-gray-500');
      }
      if (dot2 && currentStep >= 2) {
        dot2.classList.add('bg-brand-orange', 'text-white');
        dot2.classList.remove('bg-gray-200', 'text-gray-500');
      }
      if (dot3 && currentStep >= 3) {
        dot3.classList.add('bg-brand-orange', 'text-white');
        dot3.classList.remove('bg-gray-200', 'text-gray-500');
      }
    }

    // --- EVENTO: Botón Siguiente ---
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      console.log("Click en Siguiente. Paso actual:", currentStep);

      // Validación Paso 2 (Fecha obligatoria)
      if (currentStep === 2) {
        const dateInput = document.getElementById('date-input');
        if (dateInput && !dateInput.value) {
          alert("Por favor, selecciona una fecha para continuar.");
          return; 
        }
      }

      // Avanzar paso
      if (currentStep < totalSteps) {
        currentStep++;
        updateWizard();
      }
    });

    // --- EVENTO: Botón Atrás ---
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateWizard();
      }
    });

    // --- EVENTO: Submit Final (WhatsApp) ---
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Capturar datos con seguridad
      const servicio = document.querySelector('input[name="servicio"]:checked')?.value || "No especificado";
      const fecha = document.getElementById('date-input')?.value || "No especificada";
      const hora = document.querySelector('input[name="hora"]:checked')?.value || "A coordinar";
      const nombre = document.getElementById('nombre')?.value || "";
      const empresa = document.getElementById('empresa')?.value || "";
      const contacto = document.getElementById('contacto-dato')?.value || "";
      const mensaje = document.getElementById('mensaje')?.value || "";

      // Construir mensaje (Texto plano)
      const text = `Hola Bossio & Monteresino, quiero solicitar un turno:\n\n` +
        `*Servicio:* ${servicio}\n` +
        `*Fecha:* ${fecha}\n` +
        `*Hora:* ${hora}\n` +
        `*Nombre:* ${nombre}\n` +
        `*Empresa:* ${empresa}\n` +
        `*Contacto:* ${contacto}\n` +
        `*Nota:* ${mensaje}`;

      // CODIFICAR EL MENSAJE PARA URL (IMPORTANTE: encodeURIComponent)
      // Esto convierte el '&' y los espacios en códigos seguros que no rompen el link
      const encodedText = encodeURIComponent(text);

      window.open(`https://wa.me/5493471560422?text=${encodedText}`, '_blank');
    });

    // Iniciar wizard
    updateWizard();
  } else {
    console.error("Error: No se encontraron los elementos del Wizard en el HTML.");
  }
});