import { defineConfig, loadEnv } from "vite";
import { MyPlugin } from "./plugins";
import { join } from "node:path";
import { readdirSync, statSync } from "node:fs";
import { dir } from "node:console";

function getAllFolders(dir, foldersList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      foldersList.push(filePath);
      getAllFolders(filePath, foldersList);
    }
  });

  return foldersList;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const allEnv = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const {
    VITE_WORDPRESS_ROOT,
    VITE_WORDPRESS_ADD_WATCH_DIR,
    VITE_PROJECT_NAME,
  } = allEnv;
  const wpRootDir = join(VITE_WORDPRESS_ROOT, VITE_WORDPRESS_ADD_WATCH_DIR);

  const inputs = {};

  const searchDir = join(__dirname, "src/modules/");
  const names = getAllFolders(searchDir)
    .filter((dir: string) => {
      try {
        return statSync(join(dir, "index.ts")).isFile();
      } catch (e) {
        return false;
      }
    })
    .map((dir: string) => dir.replace(searchDir, ""));

  console.log("modules inluding:", names);
  names.forEach((name) => {
    inputs[name] = `./src/modules/${name}/index.ts`;
  });
  return {
    plugins: [
      MyPlugin({
        rootDir: VITE_WORDPRESS_ROOT,
        watchDir: VITE_WORDPRESS_ADD_WATCH_DIR,
        projectName: VITE_PROJECT_NAME,
      }),
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
          dir: join(wpRootDir, "dist"),
        },
      },
    },
  };
});
