/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Paleta natural / tierra / champagne
        primary: {
          50: '#faf6ef',
          100: '#f5ede0',
          200: '#e6d5b8',
          300: '#d4b483',
          400: '#c9a96a',
          500: '#b08968',
          600: '#7c5e3c',
          700: '#5c4429',
          800: '#3a3022',
          900: '#2a2418',
        },
        accent: {
          green: '#6b8e4e',
          red: '#b85450',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 1.2s ease-out forwards',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};
