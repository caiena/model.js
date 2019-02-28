module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "targets": {
          // "browsers": ["defaults"]
          // "browsers": ["last 2 versions", "safari >= 7"]
          "ios": "9",
          "ie": "11",
          "chrome": "58"
        },
        // we're using es6 on mocha (tests), so we can't use 'modules: false'
        // @see https://github.com/babel/babel/issues/8477#issuecomment-413263400
        // "modules": false,
        "useBuiltIns": "usage"
      }
    ]
  ],

  "sourceMaps": true
}
