import fs from "node:fs";
import path, { join, relative } from "node:path";
import { watch } from "chokidar";

interface WordpressConfig {
  rootDir: string; // root path of the wordpress plugins
  watchDir: string;
  watchOptions?: Record<string, any>;
  projectName: string;
}

/**
 * Write mu-plugins file
 * @param wordpressRootDir wordpress absolute root path
 * @param watchDir wordpress watch path work dir
 * @param serverHost vite dev server host
 * @param name project name
 */
const writeMuPluginsFile = (
  wordpressRootDir: string,
  watchDir: string,
  serverHost: string,
  name: string
) => {
  const tplFile = join(__dirname, "templates", "mu-plugin.tpl.php");

  let readTplFile = fs.readFileSync(tplFile, "utf8");
  readTplFile = readTplFile
    .replace(/{{SERVER_HOST}}/g, serverHost)
    .replace(/{{PROJECT_NAME}}/, name)
    .replace(/{{DEPLOY_RELATED_DIR}}/, watchDir);

  if (!fs.existsSync(wordpressRootDir)) {
    throw new Error("Wordpress root path not found");
  }
  if (!fs.existsSync(join(wordpressRootDir, "wp-content", "mu-plugins"))) {
    fs.mkdirSync(join(wordpressRootDir, "wp-content", "mu-plugins"), {
      recursive: true,
    });
  }
  fs.writeFileSync(
    join(wordpressRootDir, "wp-content", "mu-plugins", `${name}-plugin.php`),
    readTplFile,
    {
      encoding: "utf8",
      mode: 0o777,
      flag: "w",
    }
  );
};

const MyPlugin = (myConf: WordpressConfig) => {
  // console.log(content)

  // reset css
  // reload js
  // reload php

  const configureServer = (serverConfig) => {
    const { config, ws, watcher } = serverConfig;
    const {
      logger,
      server: { origin },
    } = config;
    writeMuPluginsFile(
      myConf.rootDir,
      myConf.watchDir,
      origin,
      myConf.projectName
    );

    const reload = (path: string) => {
      ws.send({ type: "full-reload", path: "*" });
      logger.info(`wordpress reloaded: ${path}`, {
        clear: true,
        timestamp: true,
      });
    };

    const cwd = join(myConf.rootDir, myConf.watchDir);
    logger.info(`started, watching: ${cwd}`, { timestamp: true });
    const defaultWatchOptions = {
      ignored: [".vite/**/*", ".git/**/*"],
      ignoreInitial: true,
      // awaitWriteFinish: {
      //   stabilityThreshold: 1000,
      //   pollInterval: 500,
      // },
    };
    const watcher2 = watch(join(cwd, "**/*"), {
      cwd,
      ...defaultWatchOptions,
      ...(myConf?.watchOptions ?? {}),
    })
      .on("add", reload)
      .on("change", reload);
  };

  return {
    name: "MyPlugin",
    configureServer,
  };
};

export { MyPlugin };
