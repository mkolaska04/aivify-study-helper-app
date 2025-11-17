
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        muted: 'var(--muted)',
        outline: 'var(--outline)',
        text: 'var(--text)',
        primary_muted: 'var(--primary_muted)',
        secondary_muted: 'var(--secondary_muted)',
        button: 'var(--button)',
        button_hover: 'var(--button_hover)',
      },
    },
  },
  plugins: [],
};

export default config;