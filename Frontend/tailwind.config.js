/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "992px",
      xl: "1280px",
      xxl: "1440px",
    },
    container: {
      center: true,
      screens: {
        sm: "100%",
        md: "100%",
        lg: "992px",
        xl: "1280px",
      },
    },
    maxWidth: {
      xxs: "20rem",
      xs: "25rem",
      sm: "30rem",
      md: "35rem",
      lg: "48rem",
      xl: "64rem",
      xxl: "80rem",
      full: "100%",
    },
    boxShadow: {
      xxsmall: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      xsmall: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
      small:
        "0px 4px 8px -2px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.06)",
      medium:
        "0px 12px 16px -4px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.03)",
      large:
        "0px 20px 24px -4px rgba(0, 0, 0, 0.08), 0px 8px 8px -4px rgba(0, 0, 0, 0.03)",
      xlarge: "0px 24px 48px -12px rgba(0, 0, 0, 0.18)",
      xxlarge: "0px 32px 64px -12px rgba(0, 0, 0, 0.14)",
    },
    fontSize: {
      xs: [
        "0.75rem",
        {
          lineHeight: "1.5",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.5",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.5",
        },
      ],
      md: [
        "1.125rem",
        {
          lineHeight: "1.5",
        },
      ],
      lg: [
        "1.25rem",
        {
          lineHeight: "1.5",
        },
      ],
      xl: [
        "1.25rem",
        {
          lineHeight: "1.4",
        },
      ],
      "2xl": [
        "1.5rem",
        {
          lineHeight: "1.4",
        },
      ],
      "3xl": [
        "1.75rem",
        {
          lineHeight: "1.4",
        },
      ],
      "4xl": [
        "2rem",
        {
          lineHeight: "1.3",
        },
      ],
      "5xl": [
        "2.25rem",
        {
          lineHeight: "1.2",
        },
      ],
      "6xl": [
        "2.5rem",
        {
          lineHeight: "1.2",
        },
      ],
      "7xl": [
        "2.75rem",
        {
          lineHeight: "1.2",
        },
      ],
      "8xl": [
        "3rem",
        {
          lineHeight: "1.2",
        },
      ],
      "9xl": [
        "3.25rem",
        {
          lineHeight: "1.2",
        },
      ],
      "10xl": [
        "3.5rem",
        {
          lineHeight: "1.2",
        },
      ],
    },
    extend: {
      spacing: {
        0: "0px",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        18: "4.5rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        30: "7.5rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
        px: "1px",
      },
      colors: {
        brand: {
          primary: "#04BB6E",
          secondary: "#DA5B14",
          neutral: "#3d3d3d",
        },
        neutral: {
          black: "#000000",
          white: "#ffffff",
        },
        system: {
          "success-green": "#027a48",
          "success-green-light": "#ecfdf3",
          "error-red": "#b42318",
          "error-red-light": "#fef3f2",
        },
        background: "hsl(var(--background))",
        border: "hsl(var(--border))",
        text: {
          light: "#fff",
          primary: "#3C3C3C",
          secondary: "#afafaf",
          success: "#027a48",
          error: "#b42318",
        },
        link: {
          DEFAULT: "#000000",
          primary: "#000000",
          secondary: "#666666",
          alternative: "#ffffff",
        },
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
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#000000",
            lineHeight: "1.5",
            maxWidth: "100%",
            p: {
              marginTop: "0",
              marginBottom: "1rem",
            },
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    keyframes: {
      pulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.5,
        },
      },
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      "accordion-down": {
        from: {
          height: "0px",
        },
        to: {
          height: "var(--radix-accordion-content-height)",
        },
      },
      "accordion-up": {
        from: {
          height: "var(--radix-accordion-content-height)",
        },
        to: {
          height: "0px",
        },
      },
      "loop-horizontally": {
        from: {
          transform: "translateX(0)",
        },
        to: {
          transform: "translateX(-100%)",
        },
      },
      "loop-testimonials": {
        from: {
          transform: "translateX(0)",
        },
        to: {
          transform: "translateX(-135rem)",
        },
      },
      "loop-vertically": {
        from: {
          transform: "translateY(0)",
        },
        to: {
          transform: "translateY(-50%)",
        },
      },
      "marquee-horizontally": {
        from: {
          transform: "translateX(0)",
        },
        to: {
          transform: "translateX(-50%)",
        },
      },
      "marquee-top": {
        from: {
          transform: "translateX(0)",
        },
        to: {
          transform: "translateX(-50%)",
        },
      },
      "marquee-right": {
        from: {
          transform: "translateX(0)",
        },
        to: {
          transform: "translateX(100%)",
        },
      },
      "marquee-bottom": {
        from: {
          transform: "translateX(-50%)",
        },
        to: {
          transform: "translateX(0%)",
        },
      },
    },
    animation: {
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      spin: "spin 1s linear infinite",
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "loop-horizontally": "loop-horizontally 20s linear infinite",
      "loop-testimonials": "loop-testimonials 30s linear infinite",
      "loop-vertically": "loop-vertically 30s linear infinite",
      "marquee-horizontally": "marquee-top 30s linear infinite",
      "marquee-top": "marquee-top 50s linear infinite",
      "marquee-right": "marquee-right 25s linear infinite",
      "marquee-bottom": "marquee-bottom 50s linear infinite",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    ({ addComponents }) => {
      const newComponents = {
        ".animate-disable": {
          animationName: "none",
          animationDuration: "0s",
          "--tw-enter-opacity": "initial",
          "--tw-enter-scale": "initial",
          "--tw-enter-rotate": "initial",
          "--tw-enter-translate-x": "initial",
          "--tw-enter-translate-y": "initial",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        },
      };
      addComponents(newComponents);
    },
  ],
};
