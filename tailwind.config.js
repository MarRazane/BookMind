/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
        teal: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
        },
        coral: {
          50:  '#FAECE7',
          400: '#D85A30',
          600: '#993C1D',
        },
        amber: {
          50:  '#FAEEDA',
          400: '#BA7517',
          600: '#854F0B',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-dot': 'bounceDot 1s infinite',
      },
      keyframes: {
        bounceDot: {
          '0%,80%,100%': { transform: 'translateY(0)' },
          '40%':          { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}