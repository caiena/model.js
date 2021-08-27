import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs    from "@rollup/plugin-commonjs"
import babel       from "@rollup/plugin-babel"
import alias       from "@rollup/plugin-alias"
import json        from "@rollup/plugin-json"
import yaml        from "@rollup/plugin-yaml"

import glob       from "rollup-plugin-glob-import"
import { terser } from "rollup-plugin-terser"

import path from "path"
import pkg  from "./package.json"

let paths  = {}
paths.root   = path.resolve(__dirname)
paths.src    = path.resolve(paths.root, "src")


const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    exclude:      ["node_modules/**"]
  }),
  alias({
    resolve: [".js" /*, ".vue" */],
    entries: {
      "@": paths.src
    }
  }),
  json(),
  yaml(),
  glob({
    format: "default",  // required for yaml plugin to work!
    rename(name, id) {
      return `${path.relative(__dirname, id)}/${name}`.replace(/[^\w]/g, "_")
    }
  })
]

const external = [
  "@caiena/i18n",
  "@caiena/lodash-ext",
  "moment",
  "validate.js"
]

const globals = {
  "@caiena/i18n":       "i18n",
  "@caiena/lodash-ext": "_",
  "moment":             "moment",
  "validate.js":        "validate"
}


export default [
  // browser-friendly UMD build
  {
    input: "src/index.js",
    output: {
      name: "model",
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
      globals
    },
    external,
    plugins
  },
  { // minified UMD build!
    input: "src/index.js",
    output: {
      name: "model",
      file: pkg.browser.replace(".js", ".min.js"),
      format: "umd",
      sourcemap: true,
      globals
    },
    external,
    plugins: [
      ...plugins,
      terser() // minify js
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/index.js",
    output: [
      { file: pkg.main,   format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es",  sourcemap: true }
    ],
    external,
    plugins
  }
]
