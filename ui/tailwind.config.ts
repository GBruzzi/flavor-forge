import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-fresh': '#6dbf6d',
        'orange-pumpkin': '#ff7f32',
        'yellow-gold': '#f8b400',
        'gray-light': '#f3f4f6',
        'gray-dark': '#4b4b4b',
        'mint-green': '#a4e4b2',
      },
    },
  },
  plugins: [],
} satisfies Config;
