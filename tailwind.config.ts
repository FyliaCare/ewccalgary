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
        ewc: {
          // Light theme core
          white: "#ffffff",
          snow: "#fafbfc",
          light: "#f3f4f6",
          mist: "#e8eaed",
          silver: "#9ca3af",
          slate: "#4b5563",
          charcoal: "#1f2937",
          black: "#111827",
          // Brand accent — rich burgundy
          burgundy: "#7B2D3B",
          "burgundy-hover": "#933548",
          "burgundy-dark": "#5C1F2C",
          "burgundy-light": "#E8C4CB",
          "burgundy-50": "#FDF2F4",
          // Neutral accent
          cream: "#F0EDEB",
          amber: "#f59e0b",
          // Dark grey for hero/contrast sections
          navy: "#1F1F21",
          "navy-light": "#2E2E30",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "warm": "0 4px 14px -2px rgba(123, 45, 59, 0.12)",
        "warm-lg": "0 10px 40px -10px rgba(123, 45, 59, 0.15)",
        "soft": "0 2px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)",
        "soft-lg": "0 10px 40px -10px rgba(0,0,0,0.1)",
        "elevation": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
        "slide-down": "slideDown 0.35s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
