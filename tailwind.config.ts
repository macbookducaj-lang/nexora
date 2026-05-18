import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0084F1',    // Le beau bleu électrique Coolblue
          hover: '#0066BC',      // Le bleu plus foncé quand on passe la souris
          light: '#DFEFFF',      // Le bleu très clair pour les petits fonds
        },
        accent: '#FF7900',       // L'orange Coolblue
        success: '#00A945',
        danger: '#D0021B',
        orange: '#FF7900',       // Ton orange pour la loupe
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
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
} as Config;