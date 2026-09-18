/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        legal: {
          navy: '#0B132B',
          dark: '#1C2541',
          slate: '#3A506B',
          teal: '#5BC0BE',
          gold: '#C5A059',
          goldLight: '#E8D39E',
          accent: '#48CAE4',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#991B1B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(11, 19, 43, 0.1)',
        'premium-hover': '0 20px 40px -15px rgba(11, 19, 43, 0.18)',
      }
    },
  },
  plugins: [],
}
