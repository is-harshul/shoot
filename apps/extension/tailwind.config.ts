import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#ecf2f8",
          200: "#dfe7f0",
          300: "#ccd8e4",
          400: "#a5b9cb",
          500: "#7d99b1",
          600: "#5f7c95",
          700: "#4a6176",
          800: "#394a5a",
          900: "#2b3743",
          950: "#1a222b",
        },
        primary: {
          50: "#f8fbff",
          100: "#e8f1ff",
          200: "#d0e3ff",
          300: "#a4ccff",
          400: "#6cabff",
          500: "#3a8aff",
          600: "#1669e6",
          700: "#0f51b4",
          800: "#0e4692",
          900: "#113c75",
          950: "#0b2548",
        },
        success: {
          50: "#e6f8f1",
          100: "#c8eddf",
          200: "#9ddfca",
          300: "#6dcfbb",
          400: "#32bba7",
          500: "#129c8c",
          600: "#0d7c6f",
          700: "#0b6259",
          800: "#0a4f48",
          900: "#083f39",
          950: "#052725",
        },
        warning: {
          50: "#fffaeb",
          100: "#feefc6",
          200: "#fcdf8a",
          300: "#fac04a",
          400: "#f99f1f",
          500: "#f48007",
          600: "#d26004",
          700: "#a84407",
          800: "#83350d",
          900: "#6b2d0f",
          950: "#3c1304",
        },
        danger: {
          50: "#fdf1f1",
          100: "#fbd9d9",
          200: "#f3adad",
          300: "#eb7e7e",
          400: "#e05151",
          500: "#d13232",
          600: "#b42626",
          700: "#921e1e",
          800: "#771c1c",
          900: "#631c1c",
          950: "#360909",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 12px 32px rgba(29, 41, 57, 0.15)",
      },
      fontFamily: {
        sans: ['"Inter var"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
