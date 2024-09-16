import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["IBM Plex Mono"],
        sans: ["IBM Plex Sans"],
        serif: ["IBM Plex Serif"],
      },
      keyframes: {
        "ping-2": {
          "75%, 100%": {
            transform: "scale(3)",
            opacity: 0,
          },
        },
      },
      animation: {
        "ping-2": "ping-2 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
