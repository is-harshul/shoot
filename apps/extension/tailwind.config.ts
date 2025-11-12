import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          slate900: "#0f172a",
          slate700: "#1e293b",
          slate100: "#e2e8f0",
          white: "#ffffff",
          frost: "rgba(255, 255, 255, 0.75)",
          frostMuted: "rgba(255, 255, 255, 0.6)",
          accent: "#60a5fa",
          accentDark: "#2563eb",
          accentSoft: "#dbeafe",
        },
        gradient: {
          primary:
            "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(244,114,182,0.8) 50%, rgba(165,180,252,0.85) 100%)",
          surface:
            "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(226,232,240,0.7) 40%, rgba(226,232,240,0.4) 100%)",
          border:
            "linear-gradient(160deg, rgba(255,255,255,0.7) 0%, rgba(226,232,240,0.3) 100%)",
        },
      },
      borderRadius: {
        glass: "16px",
        "glass-lg": "24px",
        pill: "999px",
      },
      boxShadow: {
        glass: "0 20px 45px rgba(15, 23, 42, 0.12)",
        "glass-soft": "0 12px 30px rgba(15, 23, 42, 0.08)",
        "glass-inner": "inset 0 1px 0 rgba(255,255,255,0.4)",
      },
      backdropBlur: {
        glass: "24px",
      },
      spacing: {
        glass: "1.25rem",
        "glass-sm": "0.75rem",
        "glass-lg": "1.75rem",
        "glass-xl": "2.5rem",
      },
      fontFamily: {
        sans: ['"Inter var"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
