import fs from "node:fs";
import { join } from "node:path";

interface WordpressConfig {
  wordpressRootDir: string; // root path of the wordpress plugins
}

/**
 * Write mu-plugins file
 * @param wordpressRootDir
 */
const writeMuPluginsFile = (wordpressRootDir: string, serverHost:string, inputs: string[]) => {
  const tplFile = join(__dirname, "templates", "mu-plugin.tpl.php");

  let readTplFile = fs.readFileSync(tplFile, "utf8");
  readTplFile = readTplFile.replace(/{{SERVER_HOST}}/g, serverHost);

  const tpl = '<script type="module" src="{{SERVER_HOST}}/src/modules/{{NAME}}/index.ts"></script>'
  const replaces = Object.keys(inputs).map((key) => {
    return tpl.replace(/{{NAME}}/g, key).replace(/{{SERVER_HOST}}/g, serverHost);
  });
  readTplFile = readTplFile.replace(/{{MODULES}}/g, replaces.join("\n"));

  if (!fs.existsSync(wordpressRootDir)) {
    throw new Error("Wordpress root path not found");
  }
  if (!fs.existsSync(join(wordpressRootDir, "wp-content", "mu-plugins"))){
    fs.mkdirSync(join(wordpressRootDir, "wp-content", "mu-plugins"), {
      recursive: true
    });
  }
  fs.writeFileSync(
    join(wordpressRootDir, "wp-content", "mu-plugins", "my-dev-plugin.php"),
    readTplFile,
    {
      encoding: "utf8",
      mode: 0o777,
      flag: 'w'
    }
  );
};


const MyPlugin = (myConf: WordpressConfig) => {
  // console.log(content)

  // reset css
  // reload js
  // reload php

  const configureServer = ({config, ws}) => {
    const inputs = config.build.rollupOptions.input
    const serverHost = `http://localhost:${config.server.port}`
    writeMuPluginsFile(myConf.wordpressRootDir, serverHost, inputs);
  };

  return {
    name: "MyPlugin",
    configureServer,
  };
};

export { MyPlugin };
