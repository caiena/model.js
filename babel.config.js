module.exports = {
  // exclude: ["node_modules/**"],
  presets: [
    [
      "@babel/preset-env", {
        targets: {
          ios:    "9",
          ie:     "11",
          chrome: "58"
        },

        // "usage": faz polyfill dinâmico dependendo do uso
        // "entry": faz polyfill para o ambiente (env/targets) definido
        // ref: https://babeljs.io/docs/en/babel-preset-env#usebuiltins
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ],

  plugins: [
    "convert-to-json",
    "import-glob"
  ],

  // @see https://github.com/Microsoft/vscode/issues/5728#issuecomment-340219041
  sourceMaps:  "inline",
  retainLines: true
}
