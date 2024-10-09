import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";

export default defineConfig({
  ssr: false,

  server: {
    preset: "vercel"
  },

  vite: {
    plugins: [UnoCSS()]
  }
});
