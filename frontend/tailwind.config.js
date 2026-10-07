/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#080c14",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(56, 189, 248, 0.2)",
          primary: "#06b6d4", // Cyan 500
          accent: "#8b5cf6",  // Violet 500
          neon: "#10b981",    // Emerald 500
          danger: "#ef4444"   // Red 500
        }
      },
      animation: {
        'scan': 'scan 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(6,182,212,0.6))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(139,92,246,0.9))' },
        }
      }
    },
  },
  plugins: [],
}
