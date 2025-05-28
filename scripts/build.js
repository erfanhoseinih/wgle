const fs = require("fs");
const path = require("path");
const terser = require("@rollup/plugin-terser");

function injectUtilsPlugin() {
  return {
    name: "inject-utils-plugin",
    resolveId(source) {
      if (source === "inject-utils") return source;
      return null;
    },
    load(id) {
      if (id === "inject-utils") {
        const code = fs.readFileSync(path.resolve("src/index.js"), "utf8");
        return code;
      }
      return null;
    },
  };
}

function createConfig({ input, file, format, name, minify = false }) {
  return {
    input,
    output: {
      file,
      format,
      ...(name ? { name } : {}),
    },
    plugins: [injectUtilsPlugin(), ...(minify ? [terser()] : [])],
  };
}

module.exports = {
  createConfig,
};
