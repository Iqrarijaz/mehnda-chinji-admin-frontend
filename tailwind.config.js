/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#0BDA51",
        secondary: "#2628dd",
        lightBlue:"#7CB9E8",
        hover_primary: "#a6b5ad",
      },
      // fontFamily: {
      //   inter: ["Inter", "font-mono"],
      // }
    },
  },
  plugins: [],
};
