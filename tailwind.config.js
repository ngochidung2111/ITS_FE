/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
    './public/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem',
        xl: '4rem'
      }
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial']
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          50: '#f3f4ff',
          100: '#eaecff',
          200: '#cfd5ff',
          300: '#a7b3ff',
          400: '#7f90ff',
          500: '#6366F1'
        },
        accent: {
          DEFAULT: '#06B6D4'
        }
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.08)'
      }
    }
  },
  plugins: []
}
