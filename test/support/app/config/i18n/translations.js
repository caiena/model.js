const yaml = require('js-yaml')
const glob = require('glob')
const fs   = require('fs')
const _    = require('@caiena/lodash-ext')


// global translation object (with entries per-locale)
const translations = {}

// reading yaml files recursively, per-locale
_.each(['en-US', 'pt-BR'], (locale) => {
  let localeTranslations = {}

  _.each(glob.sync(`${__dirname}/**/*.${locale}.yml`), (path) => {
    let fileYamlContent = yaml.safeLoad(fs.readFileSync(path, 'utf8'))

    _.merge(localeTranslations, fileYamlContent)
  })

  // merge locale translations to global translation object
  _.merge(translations, localeTranslations)
})


module.exports = translations
