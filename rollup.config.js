import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

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
      format: 'es',
      dir: 'dist',
      sourcemap: true,
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      nodeResolve(),
      alias({
        entries: {
          'jquery': './src/jq/jquery.js',
          'jquery-ui': './src/jq/jquery-ui.js',
          'jquery.ui': './src/jq/jquery-ui.js',
          'jquery.ui.touch-punch' : './src/jq/jquery.ui.touch-punch.js',
        }
      })
    ]
  },
]