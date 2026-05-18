import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0084F1',    // Bleu Coolblue
          hover: '#0066BC',
          light: '#DFEFFF',
        },
        accent: '#FF7900',       // Orange Coolblue
        success: '#00A945',
        danger: '#D0021B',
        orange: '#FF7900',
        page: '#F5F5F5',
        card: '#FFFFFF',
        border: '#E0E0E0',
        muted: '#767676',
        'category-hover': '#DFEFFF',
        'image-bg': '#F8F8F8',
        skeleton: '#E8E8E8',
        coolblue: {
          DEFAULT: '#0084F1',
          light: '#DFEFFF',
          hover: '#0066BC',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
} as Config;