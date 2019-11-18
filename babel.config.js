module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          ios: '9',
          ie: '11',
          chrome: '58'
        },

        useBuiltIns: 'usage',
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
