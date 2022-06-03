import compileTime from "vite-plugin-compile-time";
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  plugins: [compileTime()],
  base: "./",
};

export default config;
