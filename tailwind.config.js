module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      xs: ".7rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    dropShadow: {
      md: "0 4px 3px rgba(0, 0, 0, 0.35)",
    },
    extend: {
      colors: {
        clrMain: "hsl(211,100%,50%)",
        clrSecondary: "hsl(211, 100%, 40%)",
        clrLight: "hsl(0, 0%, 100%)",
        clrLightGray: "hsl(0, 0%, 98%)",
        clrDark: "hsl(207, 10%, 23%)",
        clrDarkBlue: "hsl(228, 39%, 23%)",
        clrGrayishBlue: "hsl(227, 12%, 61%)",
        clrVeryDarkBlue: "hsl(233, 12%, 13%)",
      },
    },
  },
  plugins: [],
}
