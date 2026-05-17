import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003082',
          hover: '#004494',
          light: '#0059A3',
        },
        accent: '#FFC515',
        success: '#00A945',
        danger: '#D0021B',
        orange: '#FF6B00',
        page: '#F5F5F5',
        card: '#FFFFFF',
        border: '#E0E0E0',
        muted: '#767676',
        'category-hover': '#EEF3FF',
        'image-bg': '#F8F8F8',
        skeleton: '#E8E8E8',
        coolblue: {
          DEFAULT: '#003082',
          light: '#0059A3',
          hover: '#004494',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config;
