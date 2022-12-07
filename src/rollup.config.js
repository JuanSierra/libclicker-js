import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: "libclicker",
  output: [
    {
      file: 'dist/libclicker.js',
      format: "iife",
      name: "libclicker"
    },
    {
      file: 'dist/libclicker.mjs',
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    commonjs()
  ]
};