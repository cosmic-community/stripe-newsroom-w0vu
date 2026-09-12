/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#F5F4FF',
          100: '#EBE9FE',
          200: '#D3CFFE',
          300: '#B3ABFD',
          400: '#8F84FC',
          500: '#7A6FFB',
          600: '#635BFF',
          700: '#5851DB',
          800: '#4A43B8',
          900: '#3A3494',
        },
        navy: {
          600: '#1E3A5F',
          700: '#153355',
          800: '#0F2C4C',
          900: '#0A2540',
        },
        lightbg: '#F6F9FC',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 4px 24px rgba(10, 37, 64, 0.08)',
        'card-hover': '0 12px 32px rgba(10, 37, 64, 0.12)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}