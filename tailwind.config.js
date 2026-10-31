/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#EBECEF',
        surface: '#F7F7F7',
        primary: {
          DEFAULT: '#0861E8',
          hover: '#0752c4',
          light: '#2575fc',
          muted: '#EBF2FF',
          dark: '#0546aa'
        },
        charcoal: {
          900: '#14181F',
          800: '#1F242D',
          700: '#323945',
          600: '#4B5565',
          500: '#697586',
          400: '#9AA4B2',
          300: '#CDD5DF',
          200: '#E3E8EF',
          100: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '28px',
        '3.5xl': '32px',
        '4xl': '38px',
        '5xl': '48px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card': '0 12px 36px -4px rgba(8, 97, 232, 0.28)',
        'card-subtle': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'nav': '0 10px 40px -6px rgba(0, 0, 0, 0.12)',
        'float': '0 14px 44px -8px rgba(0, 0, 0, 0.16)',
        'device': '0 25px 70px -15px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
