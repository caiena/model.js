// import localResolve from 'rollup-plugin-local-resolve'
// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
// import babel from 'rollup-plugin-babel'
// import glob from 'rollup-plugin-glob-import'
// import yaml from '@rollup/plugin-yaml'
// import pkg from './package.json'

// export default [
//   // browser-friendly UMD build
//   {
//     input: 'src/index.js',
//     output: {
//       name: 'model',
//       file: pkg.browser,
//       format: 'umd'
//     },
//     plugins: [
//       yaml(),
//       glob({
//         format: 'default',  // required for yaml plugin to work!
//         rename(name, id) {
//           return `${path.relative(__dirname, id)}/${name}`.replace(/[^\w]/g, '_')
//         }
//       }),

//       resolve(),
//       commonjs(),
//       babel({
//         exclude: ['node_modules/**']
//       }),
//     ]
//   },

// import localResolve from 'rollup-plugin-local-resolve'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs    from '@rollup/plugin-commonjs'
import babel       from '@rollup/plugin-babel'
import alias       from '@rollup/plugin-alias'
import json        from '@rollup/plugin-json'
import yaml        from '@rollup/plugin-yaml'

import glob from 'rollup-plugin-glob-import'

import path from 'path'
import pkg  from './package.json'

let paths  = {}
paths.root   = path.resolve(__dirname)
paths.src    = path.resolve(paths.root, "src")


export default [
  { // CJS and ESM modules
    input:  'src/index.js',
    output: [{
      file:   pkg.main,
      format: 'cjs',
      // exports: 'named',
      sourcemap: true
    }, {
      file:      pkg.module,
      format:    'esm',
      // exports:   'named',
      sourcemap: true
    }],
    external: [
      "@caiena/enum",
      "@caiena/i18n",
      "@caiena/lodash-ext",
      "moment",
      "validate.js"
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude:      ['node_modules/**']
      }),
      nodeResolve(),
      commonjs(),
      alias({
        resolve: ['.js' /*, '.vue' */],
        entries: {
          '@': paths.src
        }
      }),
      json(),
      yaml(),
      glob({
        format: 'default',  // required for yaml plugin to work!
        rename(name, id) {
          return `${path.relative(__dirname, id)}/${name}`.replace(/[^\w]/g, '_')
        }
      })
    ]
  }
]
