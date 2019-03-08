const yaml = require('js-yaml')
const glob = require('glob')
const fs   = require('fs')
const _    = require('@caiena/lodash-ext')


// global translation object (with entries per-locale)
const translations = {}

// reading yaml files recursively, per-locale
_.each(glob.sync(`${__dirname}/**/*.yml`), (path) => {
  let fileYamlContent = yaml.safeLoad(fs.readFileSync(path, 'utf8'))

  _.merge(translations, fileYamlContent)
})


module.exports = translations
