import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#111113',          // Near-Black Dark Slate
          card: '#18181b',        // Rich Dark Gray surface
          cardHover: '#232328',   // Slightly elevated card hover
          accent: '#FF5500',      // Vibrant Fiery Orange
          'accent-hover': '#FF6B35',
          'gradient-start': '#FF6B35',
          'gradient-end': '#A32A17',
          text: '#FFFFFF',        // Primary typography
          muted: '#A1A1AA',       // Secondary cool neutral gray
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 85, 0, 0.4)',
        },
      },
      backgroundImage: {
        'sunset-glow': 'radial-gradient(circle at 50% -20%, rgba(255, 107, 53, 0.25) 0%, rgba(163, 42, 23, 0.05) 50%, transparent 80%)',
        'sunset-card': 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(24, 24, 27, 0.6) 100%)',
      },
      boxShadow: {
        'sunset-glow': '0 0 40px -10px rgba(255, 85, 0, 0.45)',
        'sunset-button': '0 0 25px rgba(255, 85, 0, 0.5)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
