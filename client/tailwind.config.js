/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy / charcoal foundation
        ink: {
          950: '#05080F',
          900: '#0A1220',
          850: '#0E1A2D',
          800: '#12233B',
          700: '#1B3355',
          600: '#274873',
          500: '#35608F',
        },
        // Signal orange — primary CTA / cargo accent
        signal: {
          50: '#FFF3EC',
          100: '#FFE1CE',
          200: '#FFC2A1',
          300: '#FF9E6E',
          400: '#FF7F45',
          500: '#FF6A2C',
          600: '#ED520F',
          700: '#C63F09',
          800: '#9C330E',
          900: '#7E2D10',
        },
        // Cool steel blue — surfaces, routes, technical detail
        steel: {
          50: '#F3F6FA',
          100: '#E5EBF2',
          200: '#C9D5E4',
          300: '#A3B6CE',
          400: '#7791B3',
          500: '#566F94',
          600: '#435778',
          700: '#384864',
          800: '#2F3B52',
          900: '#1F2838',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        container: '80rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(5, 8, 15, 0.06), 0 8px 24px -12px rgba(5, 8, 15, 0.18)',
        'card-lg': '0 2px 4px rgba(5, 8, 15, 0.08), 0 24px 48px -20px rgba(5, 8, 15, 0.35)',
        glow: '0 0 0 1px rgba(255, 106, 44, 0.4), 0 12px 40px -8px rgba(255, 106, 44, 0.45)',
      },
      backgroundImage: {
        'grid-steel':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.82)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
