const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const esbuild = require('rollup-plugin-esbuild');

module.exports = {
  input: 'src/module/xdy-module-template.ts',
  output: {
    dir: 'dist/module',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript({}),
    esbuild({
      include: /\.[jt]sx?$/,
      sourceMap: true,
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
};
