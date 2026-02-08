import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f0f0f",
        mist: "#f6f3ef",
        dune: "#d7cfc7",
        sand: "#b7a99b",
        clay: "#6b5b4f",
        rose: "#d9a19b",
        default: "#222222",
        disabled: "#b6b6b6",
        borderdefault:"#e6e6e6"
      },
      fontSize: {
        title: "2.8rem",
        heading: "2.2rem",
        secondaryTitle: "1.4rem",
        subtitle: "1.6rem",
        emphasis: "3.2rem"
      }
    },
    fontFamily: {
      display: ["\"Fraunces\"", "serif"],
      body: ["\"Work Sans\"", "sans-serif"],
      farfetch: ["\"Farfetch Basis\"", "\"Helvetica Neue\"", "Arial", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
