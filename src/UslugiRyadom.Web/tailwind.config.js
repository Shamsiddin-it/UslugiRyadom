/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        background: '#f8fafc',
        foreground: '#0f172a',
        muted: '#64748b',
        surface: '#ffffff',
        primary: {
          DEFAULT: '#0f766e',
          dark: '#115e59',
          light: '#ccfbf1',
        },
        accent: {
          DEFAULT: '#ea580c',
          soft: '#ffedd5',
        },
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 23, 42, 0.06)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(234, 88, 12, 0.14), transparent 30%)',
      },
    },
  },
  plugins: [],
};
