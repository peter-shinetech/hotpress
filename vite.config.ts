import { defineConfig, loadEnv } from "vite";
import { MyPlugin } from "./plugins";

// https://vitejs.dev/config/
export default defineConfig( ({mode}) => {
  const allEnv = {...process.env, ...loadEnv(mode, process.cwd())};
  const {VITE_WORDPRESS_ROOT,VITE_BUILD_MODULES } = allEnv
  const names = VITE_BUILD_MODULES.split(",");
  const inputs = {};
  names.forEach(name => {
    inputs[name] = `./src/modules/${name}/index.ts`
  });
  return {
    plugins: [
      MyPlugin({
        wordpressRootDir: VITE_WORDPRESS_ROOT
      })
    ],
  
    server: {
      cors: true,
      port: 18500,
      host: "0.0.0.0",
    },
  
    build: {
      manifest: true,
      rollupOptions: {
        input: inputs,
        output: {
          entryFileNames: 'entry-[name].[hash].js'
        }
      },
      
    },
  }
});
