/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        detailCard: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // #00000040 is rgba(0, 0, 0, 0.25)
      },
    },
  },
  plugins: [],
};
