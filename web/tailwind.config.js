/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8", // Google style blue
        secondary: "#F1F3F4",
        background: "#FFFFFF",
        textMain: "#202124",
        textMuted: "#5F6368",
        border: "#DADCE0",
      }
    },
  },
  plugins: [],
}
