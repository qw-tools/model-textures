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
        playerSkin: resolve(__dirname, "index.html"),
        miscModels: resolve(__dirname, "misc_models.html"),
        weaponModels: resolve(__dirname, "weapon_models.html"),
        armorModels: resolve(__dirname, "armor_models.html"),
      },
    },
  },
});
