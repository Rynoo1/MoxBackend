import daisyui from 'daisyui'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}', './renderer/src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {}
  },
  plugins: [daisyui, tailwindScrollbarHide],
  darkMode: 'class'
}

export default config
