import type { Config } from "tailwindcss";

export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A"
        },

        surface: {
          background: "var(--surface-background)",
          backgroundSoft: "var(--surface-bg-soft)",
          card: "var(--surface-card)",
          popover: "var(--surface-popover)",
          muted: "var(--surface-muted)",
          accent: "var(--surface-accent)"
        },

        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          onPrimary: "var(--text-on-primary)",
        },

        border: {
          DEFAULT: "var(--border-default)",
          input: "var(--border-input)",
          focus: "var(--border-focus)",
        },
      },

      fontFamily: {
        primary: "var(--font-primary)",
      },

      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px"
      },
    },
  },

  plugins: [],
} satisfies Config;
