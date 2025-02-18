/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
const {heroui} = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B88E2F',
        'font-pri': '#3A3A3A',
        'bg-box': '#FFF3E3'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(),heroui()],
}

