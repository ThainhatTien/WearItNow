/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '768': '768px',  // iPad Mini, iPad Air
        '820': '820px',  // iPad Air
      },
    },
  },
  plugins: [],
}