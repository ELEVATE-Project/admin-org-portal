import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss"; // Import Tailwind CSS
import autoprefixer from "autoprefixer"; // Import Autoprefixer
import path from "path"; // Import path to use for alias configuration

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  // Configure PostCSS with imported plugins
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()], // Use imported plugins here
    },
  },
  // Add alias configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Set '@' to point to the 'src' directory
      "@shadcn/ui": "node_modules/@shadcn/ui",
    },
  },
});
