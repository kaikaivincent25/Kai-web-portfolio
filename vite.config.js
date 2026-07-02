import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Optional: proxy /api calls straight to Django during dev so you don't
    // need CORS configured for local work. Remove if you'd rather rely on
    // CORS_ALLOWED_ORIGINS from the backend settings.
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});