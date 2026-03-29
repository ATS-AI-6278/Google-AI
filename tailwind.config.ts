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
        apple: {
          bg: "#f5f5f7",
          glass: "rgba(255, 255, 255, 0.7)",
          border: "rgba(0, 0, 0, 0.1)",
        },
        studio: {
          primary: "#3b82f6",
          surface: "#ffffff",
        },
        forge: {
          primary: "#2563eb", // Blue-600
          accent: "#3b82f6", // Blue-500
          surface: "#0a0a0b",
          border: "rgba(255, 255, 255, 0.05)",
          muted: "#71717a",
        }
      },
      borderRadius: {
        "apple-xl": "24px",
        "apple-2xl": "32px",
        "forge-xl": "16px",
        "forge-2xl": "24px",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
      backgroundImage: {
        "gradient-studio": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-forge": "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
