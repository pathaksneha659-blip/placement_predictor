/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Crema Marfil inspired
        cream: {
          bg: "#E8DCC8",
          light: "#F5EFE6",
          DEFAULT: "#E0D4C0",
          dark: "#D4C4AC",
        },

        beige: {
          50: "#F5EFE6",
          100: "#EAE0D2",
          200: "#E0D4C0",
          300: "#D4C4AC",
          400: "#C8B69A",
          500: "#B8A488",
          600: "#A08B70",
          700: "#84705A",
          800: "#685644",
          900: "#4A3D30",
        },

        // Dusty rose
        rose: {
          50: "#F4E8E8",
          100: "#E8D1D1",
          200: "#DBBBBA",
          300: "#CEA4A3",
          400: "#C18E8D",
          500: "#B47876",
          600: "#9E6260",
          700: "#854F4D",
          800: "#6A3E3C",
          900: "#4E2D2B",
        },

        // Compatibility Aliases
        navy: {
          bg: "#E8DCC8",
          sidebar: "#E0D4C0",
          card: "#F5EFE6",
          border: "#D4C4AC",
        },

        indigo: {
          primary: "#9E6260",
          hover: "#854F4D",
          500: "#9E6260",
          600: "#854F4D",
          700: "#6A3E3C",
          900: "#4E2D2B",
          950: "#3A2120",
        },

        violet: {
          primary: "#B47876",
          soft: "#CEA4A3",
          500: "#B47876",
          600: "#9E6260",
          900: "#6A3E3C",
        },

        slate: {
          main: "#2A221A",
          muted: "#A89578",
          subtle: "#8A7658",
        },

        success: "#7A8A6F",
        warning: "#B8A080",
        error: "#B47876",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],

        serif: [
          "Playfair Display",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "0.875rem",
        "3xl": "1rem",
      },

      boxShadow: {
        luxury: "0 12px 35px rgba(76, 55, 40, 0.12)",
        soft: "0 6px 20px rgba(76, 55, 40, 0.08)",
        card: "0 4px 14px rgba(76, 55, 40, 0.10)",
      },

      backgroundImage: {
        "warm-gradient":
          "linear-gradient(135deg, #F5EFE6 0%, #EAE0D2 50%, #E0D4C0 100%)",

        "rose-gradient":
          "linear-gradient(135deg, #CEA4A3 0%, #B47876 100%)",

        "marble-gradient":
          "linear-gradient(135deg, #F5EFE6 0%, #E8DCC8 50%, #F5EFE6 100%)",
      },
    },
  },

  plugins: [],
};