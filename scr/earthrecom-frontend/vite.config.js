import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy":
        "default-src 'self' blob: data: https: http:; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https: http:; " +
        "worker-src 'self' blob:; " +
        "style-src 'self' 'unsafe-inline' https: http:; " +
        "img-src 'self' data: blob: https: http:; " +
        "connect-src 'self' https: http: ws:;"
    }
  }
});
