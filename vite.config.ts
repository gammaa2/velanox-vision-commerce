import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 8080,

    // 🔥 Fix redirect issues in dev
    historyApiFallback: true,
  },

  // 🔥 Fix redirect issues in production
  build: {
    outDir: "dist",
  },
});