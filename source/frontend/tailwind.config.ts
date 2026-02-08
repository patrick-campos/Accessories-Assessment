import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        xs: "0.4rem",
        sm: "2.4rem",
        md: "3.6rem",
        lg: "4.8rem",
        xl: "4.8rem"
      },
      borderRadius: {
        xs: "0.4rem",
        sm: "0.8rem",
        md: "3.6rem",
        lg: "4.8rem",
        xl: "4.8rem",
        xsround: "0.5rem",
        smround: "0.8rem"
      },
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
      },
      lineHeight: {
        tight: "1.1",
        snug: "1.25",
        normal: "1.375",
        relaxed: "1.75",
        loose: "2"
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
