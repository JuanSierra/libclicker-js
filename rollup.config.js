import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: "src/libclicker",
  output: [
    {
      file: 'dist/libclicker.js',
      format: 'cjs'
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