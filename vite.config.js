import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const vuePlugin = vue({
  template: {
    compilerOptions: {
      isCustomElement: tag => ['model-viewer'].includes(tag)
    }
  }
});

export default defineConfig({
  base: "https://vikpe.org/qw-gfx/",
  define: {
    'process.env': process.env,
  },
  plugins: [
    vuePlugin
  ]
});
