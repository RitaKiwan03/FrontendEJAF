import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ✅ EJAF Brand Colors
        brand: {
          blue: "#00318C",
          cyan: "#66FFFF",
          yellow: "#FDF156",
          chartreuse: "#CCFF33",
          carolina: "#7BAFDE",
          white: "#FFFFFF",
          gray: "#F7FAFC",
        },
      },
      fontFamily: {
        impact: ["Impact", "Arial Narrow", "sans-serif"],
        noto: ["Noto Kufi Arabic", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        "brand-blue": "0 0 40px rgba(0, 49, 140, 0.4)",
        "brand-cyan": "0 0 40px rgba(102, 255, 255, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #00318C 0%, #001a4d 100%)",
        "hero-gradient":
          "linear-gradient(180deg, #000d24 0%, #000510 50%, #000000 100%)",
        "cyan-glow":
          "radial-gradient(circle, rgba(102,255,255,0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
