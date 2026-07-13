import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors are wired to CSS variables (channel triples) so a guide can be
      // re-themed per event via a `[data-brand='…']` scope in globals.css
      // WITHOUT touching any component. Defaults (in :root) equal the original
      // hex values, so existing guides (Rocky Mountain, Grand Teton) render
      // byte-identical. The `<alpha-value>` placeholder keeps `/opacity`
      // modifiers (e.g. `text-vr-cream/70`) working.
      colors: {
        'vr-forest':     'rgb(var(--vr-forest-rgb) / <alpha-value>)',
        'vr-deep':       'rgb(var(--vr-deep-rgb) / <alpha-value>)',
        'vr-cream':      'rgb(var(--vr-cream-rgb) / <alpha-value>)',
        'vr-earth':      'rgb(var(--vr-earth-rgb) / <alpha-value>)',
        'vr-sky':        'rgb(var(--vr-sky-rgb) / <alpha-value>)',
        'vr-sandstone':  'rgb(var(--vr-sandstone-rgb) / <alpha-value>)',
        'vr-floral':     'rgb(var(--vr-floral-rgb) / <alpha-value>)',
        'vr-white':      'rgb(var(--vr-white-rgb) / <alpha-value>)',
        'vr-offwhite':   'rgb(var(--vr-offwhite-rgb) / <alpha-value>)',
        'vr-mid':        'rgb(var(--vr-mid-rgb) / <alpha-value>)',
        'vr-pine':       'rgb(var(--vr-pine-rgb) / <alpha-value>)',  // Trailhead: nav bar
        'vr-night':      'rgb(var(--vr-night-rgb) / <alpha-value>)', // Trailhead: deepest (bands, footer)
        'vr-line':       'rgb(var(--vr-line-rgb) / <alpha-value>)',  // Trailhead: hairline on light cards
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
