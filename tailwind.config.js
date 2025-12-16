/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F39C4F', // Naranja corporativo
          grey: '#6C6E71',   // Gris corporativo
          black: '#1A1A1A',  // Negro suave
          white: '#FFFFFF',  // Blanco puro
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'], // Fallback solicitado
        body: ['"Lato"', 'sans-serif'],
      },
      boxShadow: {
        'pro': '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
        'orange': '0 10px 25px -5px rgba(243, 156, 79, 0.4)',
      }
    },
  },
  plugins: [],
}