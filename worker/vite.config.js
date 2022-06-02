const path = require("path");
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib.js"),
      name: "@summarizer/worker",
      fileName: (format) => `summarizer-worker.${format}.js`,
    },
  },
  worker: {
    format: "iife",
  },
};

export default config;
