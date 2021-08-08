const { nodeResolve } = require('@rollup/plugin-node-resolve');
const esbuild = require('rollup-plugin-esbuild');

module.exports = {
  input: 'src/module/xdy-party-group.ts',
  output: {
    dir: 'dist/module',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    esbuild({
      include: /\.[jt]sx?$/,
      sourceMap: true,
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
};
