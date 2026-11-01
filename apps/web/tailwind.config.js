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
        // Official PaperTrail Design Tokens from Spec
        pt: {
          blue: '#1D5FF0',
          blueSecondary: '#3B82F6',
          blueDeep: '#0752D9',
          bg: '#FFFFFF',
          bgSecondary: '#F7F9FC',
          textPrimary: '#0F172A',
          textSecondary: '#64748B',
          border: '#E2E8F0',
          lightBlue: '#EAF1FF',
          success: '#27A879',
          warning: '#F5A623',
          danger: '#F04452',
          lavender: '#F0EAFE',
          financeGreen: '#E8F6EF',
          insuranceOrange: '#FFF2E6',
          healthPink: '#FCECF3',
          neutralGrey: '#F0F2F6',
        },
        primary: {
          DEFAULT: '#1D5FF0',
          hover: '#0752D9',
          light: '#3B82F6',
          muted: '#EAF1FF',
          dark: '#053EA8',
        },
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
        'subtle': '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'card': '0 8px 24px -4px rgba(29, 95, 240, 0.22)',
        'hero': '0 16px 40px -6px rgba(29, 95, 240, 0.32), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'nav': '0 12px 36px -4px rgba(15, 23, 42, 0.12)',
        'sheet': '0 -10px 40px rgba(15, 23, 42, 0.16)',
        'float': '0 10px 30px -4px rgba(29, 95, 240, 0.35)',
      }
    },
  },
  plugins: [],
}
