import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
const vuePlugin = vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => "model-viewer" === tag,
    },
  },
});

export default defineConfig({
  base: "https://vikpe.org/qw-gfx/",
  define: {
    "process.env": process.env,
  },
  plugins: [vuePlugin],
  build: {
    rollupOptions: {
      input: {
        modelTextureEditor: resolve(__dirname, "index.html"),
        CharsetEditor: resolve(__dirname, "charset.html"),
      },
    },
  },
});
