/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060814',
        panel: '#0b1226',
        neonBlue: '#00F0FF',
        neonGreen: '#39FF14',
        neonPurple: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 18px rgba(0, 240, 255, 0.45)',
        green: '0 0 18px rgba(57, 255, 20, 0.4)',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        pulseLine: 'pulseLine 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

