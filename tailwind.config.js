/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegúrate de que las rutas a tus archivos HTML sean correctas aquí
  content: ["./*.html", "./src/**/*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f766e',      // Fondo Principal
          primary: '#0f766e', // Azul Brillante
          accent: '#82FCCC',  // Cian/Turquesa
          secondary: '#82FCCC'
        },
	'brand-dark': '#0f766e',
	'brand-darker': '#00285c',
	'brand-accent': '#82FCCC',
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
            'box-shadow': '0 0 0px rgba(130,252,204, 0)'
          },
          '50%': {
            opacity: '1',
            'box-shadow': '0 0 15px rgba(130,252,204, 1)'
          },
        }
      }
    },
  },
  plugins: [],
}

