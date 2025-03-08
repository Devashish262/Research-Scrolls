import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the repository name for GitHub Pages deployment
// This will be used as the base path for assets in production
const getBase = () => {
  // When deploying to GitHub Pages, use the repository name as the base
  // Example: https://username.github.io/repo-name/
  if (process.env.NODE_ENV === 'production') {
    return '/research-scrolls/';
  }
  // In development, use the root
  return '/';
};

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: getBase(),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
