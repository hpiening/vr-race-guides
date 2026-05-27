import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vr-forest':     '#313832', // Rock
        'vr-deep':       '#264533', // Half Marathon green
        'vr-cream':      '#f3e2cc', // Sand
        'vr-earth':      '#756356', // Earth
        'vr-sky':        '#7BADAC', // Sky
        'vr-sandstone':  '#8B4411', // Sandstone
        'vr-floral':     '#da8165', // Floral
        'vr-white':      '#FFFFFF',
        'vr-offwhite':   '#FAF7F2',
        'vr-mid':        '#6B7068',
      },
      fontFamily: {
        'scale-condensed': ['Scale Condensed', 'Oswald', 'sans-serif'],
        'scale-bold':      ['Scale', 'Arial Black', 'sans-serif'],
        'scale-medium':    ['Scale Medium', 'Arial', 'sans-serif'],
        'forma-text':      ['Forma DJR Text', 'DM Sans', 'sans-serif'],
        'forma-micro':     ['Forma DJR Micro', 'DM Sans', 'sans-serif'],
        'fraunces':        ['Fraunces 72pt', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
