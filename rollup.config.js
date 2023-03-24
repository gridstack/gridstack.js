import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

// rollup.config.js
/**
* @type {import('rollup').RollupOptions[]}
*/
export default [
  {
    input: {
      'gridstack': './src/gridstack.ts'
    },
    output: {
      format: 'esm',
      dir: './dist/esm',
      sourcemap: true,
      globals: {
        jquery: '$'
      },
      preserveModules: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outDir: './dist/esm',
        module: "esnext",
        declaration: true,
        stripInternal: true,
      }),
      nodeResolve({
        browser: true,
      })
    ]
  }
]