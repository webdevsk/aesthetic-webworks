import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "5.625rem",
        screens: {
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
          "2xl": "100%",
          "3xl": "100%",
        },
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontSize: {
        normal: "1rem",
        huge: "7.5vw",
      },
      spacing: {
        huge: "7.5vw",
      },
      lineHeight: {
        tight: "1.15",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        gradientMove: "gradientMove 3s linear infinite",
      },
      backgroundImage: {
        radialToBr: "radial-gradient(circle at 75% 140%,#545cff 0,transparent 35%)",
      },
      keyframes: {
        gradientMove: {
          "0%": {
            backgroundPosition: "0 1600px",
          },
          "100%": {
            backgroundPosition: "1600px 0",
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addComponents }) {
      addComponents({
        ".variant-h1": {
          fontSize: "clamp(2rem, 7.5vw, 7.5rem)",
          lineHeight: "1.1",
          fontWeight: "600",
        },
        ".variant-h2": {
          fontSize: "clamp(1.8rem, 3.5vw, 5rem)",
          lineHeight: "1.4",
          fontWeight: "600",
        },
        ".variant-h3": {
          fontSize: "clamp(1.5rem, 2.5vw, 3.5rem)",
          lineHeight: "1.4",
          fontWeight: "600",
        },
        ".variant-h4": {
          fontSize: "1.5vw",
          lineHeight: "1.4",
          fontWeight: "400",
        },
        ".variant-h5": {
          fontSize: "24px",
          lineHeight: "1.4",
          fontWeight: "400",
        },
        ".variant-h6": {
          fontSize: "16px",
          lineHeight: "1.5",
          fontWeight: "500",
        },
        ".variant-p": {
          fontSize: "16px",
          lineHeight: "1.6",
          fontWeight: "400",
        },
        ".variant-small": {
          fontSize: "14px",
          lineHeight: "1.6",
          fontWeight: "400",
        },
        ".variant-xs": {
          fontSize: "12px",
          lineHeight: "1.6",
          fontWeight: "400",
        },
      })
    }),
  ],
} satisfies Config
