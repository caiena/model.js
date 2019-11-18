import localResolve from 'rollup-plugin-local-resolve'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import glob from 'rollup-plugin-glob-import'
import yaml from '@rollup/plugin-yaml'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'model',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      yaml(),
      glob({
        format: 'default',  // required for yaml plugin to work!
        rename(name, id) {
          return `${path.relative(__dirname, id)}/${name}`.replace(/[^\w]/g, '_')
        }
      }),

      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      }),
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    external: [
      '@caiena/lodash-ext',
      '@caiena/i18n',
      'moment',
      '@caiena/enum',
      'validate.js'
    ],
    output:{
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      localResolve(),
      babel({
        exclude: ['node_modules/**'],
        presets: [[
          "@babel/preset-env", {
            targets: {
              node: "8"
            }
          }
        ]]
      }),
    ]
  },

  // and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'esm'
    },
    external: [
      '@caiena/lodash-ext',
      '@caiena/i18n',
      'moment',
      '@caiena/enum',
      'validate.js'
    ],
    plugins: [
      yaml(),
      glob({
        format: 'default',  // required for yaml plugin to work!
        rename(name, id) {
          return `${path.relative(__dirname, id)}/${name}`.replace(/[^\w]/g, '_')
        }
      }),

      commonjs(),
      localResolve(),
      babel({
        exclude: ['node_modules/**']
      }),
    ]
  },
];
