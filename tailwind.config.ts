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
        'vr-forest':  '#313832',
        'vr-cream':   '#F4E2CC',
        'vr-amber':   '#C8873A',
        'vr-white':   '#FFFFFF',
        'vr-offwhite':'#FAF7F2',
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
