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
        'vr-forest':     '#313832',
        'vr-deep':       '#264533',
        'vr-cream':      '#f3e2cc',
        'vr-earth':      '#756356',
        'vr-sky':        '#7BADAC',
        'vr-sandstone':  '#8B4411',
        'vr-floral':     '#da8165',
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
