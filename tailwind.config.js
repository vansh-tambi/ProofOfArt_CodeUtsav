import type { Config } from 'tailwindcss'
const plugin = require('tailwindcss/plugin')

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can add custom theme colors here if needed
      // colors: {
      //   'brand-purple': '#4c1d95',
      //   'brand-blue': '#1e3a8a',
      // },
    },
  },
  plugins: [
    // This plugin adds our custom 'glass-card' utility
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.05)', // Very subtle white tint
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)', // Safari support
          'border': '1px solid rgba(255, 255, 255, 0.1)', // Faint white border
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
        },
      })
    }),
  ],
}
export default config