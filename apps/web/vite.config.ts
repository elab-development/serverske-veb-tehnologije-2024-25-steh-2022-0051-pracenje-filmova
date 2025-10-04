import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import { analyzer } from "vite-bundle-analyzer"

export default defineConfig({
  plugins: [
    react(),
    analyzer({
      analyzerMode: "static",
      defaultSizes: "gzip",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
})
