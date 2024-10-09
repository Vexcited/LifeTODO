import { defineConfig } from "unocss";

export default defineConfig({
  theme: {
    fontFamily: {
      sans: "'Comic Mono', monospace"
    }
  },

  safelist: ["bg-[#09090b]", "text-[#fafafa]", "font-sans", "font-400"]
});
