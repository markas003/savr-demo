import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        panel: "#0b1327",
        line: "rgba(255,255,255,0.08)",
        visaBlue: "#4c8dff",
        visaBlueSoft: "#7eb7ff",
        visaGold: "#f7c45a",
      },
      boxShadow: {
        phone: "0 50px 100px rgba(2, 6, 23, 0.55)",
        panel: "0 20px 50px rgba(0, 0, 0, 0.28)",
        floating: "0 14px 30px rgba(19, 32, 70, 0.28)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        "soft-pulse": "softPulse 2.8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        rise: "rise 500ms ease-out",
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
