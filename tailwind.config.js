/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],

  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      xs: "360px", // 추가: 최소 너비
      "2xl": "1080px", // 수정: 최대 너비
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        "light-purple": "#A29AFF",
        "dark-purple": "#564AD6",
        "light-gray": "#898A8D",
        "material-color": "#3F51B5",
      },
      height: {
        71: "71px",
      },
    },
  },
};
