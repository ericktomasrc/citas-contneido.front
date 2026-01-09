/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        }
      }
    },
     keyframes: {
        // 'slide-in': {
        //   '0%': { transform: 'translateX(100%)', opacity: '0' },
        //   '100%': { transform: 'translateX(0)', opacity: '1' },
        // },
        'slide-up': {
          '0%': { 
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
                'slideIn': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
          'pulse-ring': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.7',
            transform: 'scale(1.05)'
          }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite', 
        'slide-up': 'slide-up 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
      },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}