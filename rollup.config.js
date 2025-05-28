const { createConfig } = require("./scripts/build");
const { cleanBuild } = require("./scripts/clean-build");

cleanBuild();

module.exports = [
  createConfig({
    input: "src/index.js",
    file: "dist/wgle.module.js",
    format: "es",
  }),
  createConfig({
    input: "src/index.js",
    file: "dist/wgle.module.min.js",
    format: "es",
    minify: true,
  }),
  createConfig({
    input: "src/index.js",
    file: "dist/wgle.cjs",
    format: "cjs",
  }),
  createConfig({
    input: "src/index.js",
    file: "dist/wgle.min.cjs",
    format: "cjs",
    minify: true,
  }),

  createConfig({
    input: "src/index.js",
    file: "dist/wgle.iife.js",
    format: "iife",
    name: "WGLE",
  }),
  createConfig({
    input: "src/index.js",
    file: "dist/wgle.iife.min.js",
    format: "iife",
    name: "WGLE",
    minify: true,
  }),

  // createConfig({
  //   input: "src/runtime/bootstrap.js",
  //   file: "dist/wgle.runtime.js",
  //   format: "es",
  //   name: "WGLE",
  // }),
  // createConfig({
  //   input: "src/runtime/bootstrap.js",
  //   file: "dist/wgle.runtime.min.js",
  //   format: "es",
  //   name: "WGLE",
  //   minify: true,
  // }),
];
