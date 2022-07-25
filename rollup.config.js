import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('@rollup/plugin-alias').RollupAliasOptions }
 */
const aliasOptions = {
  entries: {
    'jquery': './src/jq/jquery.js',
    'jquery-ui': './src/jq/jquery-ui.js',
    'jquery.ui': './src/jq/jquery-ui.js',
    'jquery.ui.touch-punch' : './src/jq/jquery.ui.touch-punch.js',
  }
}

// rollup.config.js
/**
* @type {import('rollup').RollupOptions[]}
*/
export default [
  {
    input: {
      'gridstack-h5': './src/gridstack-h5.ts',
      'gridstack-jq': './src/gridstack-jq.ts',
      'gridstack-static': './src/gridstack-static.ts'
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
      }),
      alias(aliasOptions)
    ]
  }
]