/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT.js";


export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false,
  theme: {
    colors: {
      background: "rgba(0, 0, 0, 0.8)",
      text_primary: "#fff",
      text_secondary: "rgba(255, 255, 255, 0.7)",
      text_disabled: "rgba(255, 255, 255, 0.5)",
      button_active: "rgba(5, 83, 245, 0.57)",
      button_hover: "rgba(5, 83, 245, 0.3)",
      button_selected: "rgba(255, 255, 255, 0.16)",
      button_disabled: "rgba(255, 255, 255, 0.3)",
      button_disabled_background: "rgba(255, 255, 255, 0.12)",
      divider: "#121212"
    },
    extend: {},
  },
  plugins: [],
})

