import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: "popup/index.html",
        options: "options/index.html",
        content: "content/content.ts",
        background: "background/background.html"
      },

      output: {
        entryFileNames: "[name].js"
      }
    }
  }
})
