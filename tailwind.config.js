import { defineConfig } from "@tailwindcss/vite";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#102C54",
          900: "#0f172a",
          DEFAULT: "#102C54", // adding main primary color
        },
        accent: {
          orange: "#FF5C35",
          blue: "#102C54",
          DEFAULT: "#FF5C35", // adding main accent color
        },
        success: {
          DEFAULT: "#10b981", // adding main success color
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
        },
        warning: {
          DEFAULT: "#f59e0b",
        },
        error: {
          DEFAULT: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
});
