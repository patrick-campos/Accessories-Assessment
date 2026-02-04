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
      },
    },
    fontFamily: {
      display: ["\"Fraunces\"", "serif"],
      body: ["\"Work Sans\"", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
