import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  safelist: [
    "goog-te-combo",
    "goog-logo-link",
    "goog-te-gadget",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes:[
    "pastel",
    "retro",
    "coffee",
    "forest",
    "cyperpunk",
    "synthwave",
    "luxury",
    "autumn",
    "valentine",
    "aqua",
    "business",
    "night",
    "dracula",
  ],
  },
};