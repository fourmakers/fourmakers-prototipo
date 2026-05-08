import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "375px",
        tablet: "820px",
        "3xl": "1920px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-text-inverse)",
          soft: "var(--color-primary-soft)",
          strong: "var(--color-primary-strong)",
        },
        primarySoft: "var(--color-primary-soft)",
        primaryStrong: "var(--color-primary-strong)",

        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-text-inverse)",
          soft: "var(--color-accent-soft)",
        },
        accentSoft: "var(--color-accent-soft)",

        accentSecondary: {
          DEFAULT: "var(--color-accent-secondary)",
          foreground: "var(--color-primary-text)",
          soft: "var(--color-accent-secondary-soft)",
        },
        accentSecondarySoft: "var(--color-accent-secondary-soft)",

        primaryText: "var(--color-primary-text)",
        secondaryText: "var(--color-secondary-text)",
        placeholder: "var(--color-text-placeholder)",
        inverseText: "var(--color-text-inverse)",

        primaryBackground: "var(--color-primary-background)",
        secondaryBackground: "var(--color-secondary-background)",
        surface: "var(--color-surface-elevated)",
        "surface-elevated": "var(--color-surface-elevated)",
        "surface-overlay": "var(--color-surface-elevated)",
        surfaceElevated: "var(--color-surface-elevated)",
        surfaceSubtle: "var(--color-surface-subtle)",

        borderDefault: "var(--color-border-default)",
        borderSoft: "var(--color-border-soft)",
        field001: "var(--color-field-001)",

        btnPrimary: "var(--color-btn-primary)",
        btnPrimaryHover: "var(--color-btn-primary-hover)",
        btnSecondary: "var(--color-btn-secondary)",
        btnSecondaryText: "var(--color-btn-secondary-text)",
        btnGhostHover: "var(--color-btn-ghost-hover)",

        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",

        successSoft: "var(--color-success-soft)",
        warningSoft: "var(--color-warning-soft)",
        errorSoft: "var(--color-error-soft)",
        infoSoft: "var(--color-info-soft)",

        successBorder: "var(--color-success-border)",
        warningBorder: "var(--color-warning-border)",
        errorBorder: "var(--color-error-border)",
        infoBorder: "var(--color-info-border)",

        "on-primary": "var(--color-text-on-primary)",
        "on-accent": "var(--color-text-on-accent)",
        "on-accent-secondary": "var(--color-text-on-accent-secondary)",
        "on-gradient": "var(--color-text-on-gradient)",
        "on-success": "var(--color-text-on-success)",
        "on-success-muted": "var(--color-text-on-success-muted)",
        "on-warning": "var(--color-text-on-warning)",
        "on-warning-muted": "var(--color-text-on-warning-muted)",
        "on-error": "var(--color-text-on-error)",
        "on-error-muted": "var(--color-text-on-error-muted)",
        "on-info": "var(--color-text-on-info)",
        "on-info-muted": "var(--color-text-on-info-muted)",
        "on-destructive": "var(--color-text-on-destructive)",
        "on-destructive-muted": "var(--color-text-on-destructive-muted)",

        // shadcn: canvas principal = secondaryBackground (fourmakers-v2)
        background: "var(--color-secondary-background)",
        foreground: "var(--color-primary-text)",
        card: {
          DEFAULT: "var(--color-surface-elevated)",
          foreground: "var(--color-primary-text)",
        },
        popover: {
          DEFAULT: "var(--color-surface-elevated)",
          foreground: "var(--color-primary-text)",
        },
        muted: {
          DEFAULT: "var(--color-surface-subtle)",
          foreground: "var(--color-secondary-text)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-text-on-destructive)",
        },
        secondary: {
          DEFAULT: "var(--color-primary-soft)",
          foreground: "var(--color-primary-text)",
        },
        border: "var(--color-border-default)",
        input: "var(--color-field-001)",
        ring: "var(--color-primary)",
        sidebar: {
          DEFAULT: "var(--color-surface-elevated)",
          foreground: "var(--color-primary-text)",
          primary: "var(--color-primary)",
          "primary-foreground": "var(--color-text-inverse)",
          accent: "var(--color-accent)",
          "accent-foreground": "var(--color-text-inverse)",
          border: "var(--color-border-default)",
          ring: "var(--color-primary)",
        },
      },
      borderRadius: {
        xsToken: "var(--radius-xs)",
        smToken: "var(--radius-sm)",
        mdToken: "var(--radius-md)",
        lgToken: "var(--radius-lg)",
        pillToken: "var(--radius-pill)",
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      spacing: {
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
      },
      boxShadow: {
        softToken: "var(--elevation-soft)",
        cardHoverToken: "var(--elevation-card-hover)",
      },
      backgroundImage: {
        "brand-gradient": "var(--color-background-brand)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "caret-blink": {
          "0%, 70%, 100%": { opacity: "1" },
          "20%, 50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
