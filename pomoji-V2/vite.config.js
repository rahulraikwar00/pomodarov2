import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: "popup/popup.js",
        options: "options/options.js",
        background: "service-worker.js",
      },
    },
  },
});
