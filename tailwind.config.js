/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegúrate de que las rutas a tus archivos HTML sean correctas aquí
  content: ["./*.html", "./src/**/*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#00357a',      // Fondo Principal
          primary: '#004aad', // Azul Brillante
          accent: '#5ce1e6',  // Cian/Turquesa
          secondary: '#78d25e'
        },
	'brand-dark': '#00357a',
	'brand-darker': '#00285c',
	'brand-accent': '#5ce1e6',
	'brand-footer': '#002a60',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'ui-sans-serif', 'system-ui', 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'glow': 'glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': {
            opacity: '1',
            'box-shadow': '0 0 0px rgba(92, 225, 230, 0)'
          },
          '50%': {
            opacity: '1',
            'box-shadow': '0 0 15px rgba(92, 225, 230, 1)'
          },
        }
      }
    },
  },
  plugins: [],
}

