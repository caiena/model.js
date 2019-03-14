// on mocha tdd land, we can rely on Node specific code!
const yaml = require('js-yaml')
const glob = require('glob')
const fs   = require('fs')
const _    = require('@caiena/lodash-ext')

const { translations: coreTranslations } = require('../../../../../src/index.js')


// global translation object (with entries per-locale)
const translations = _.merge({}, coreTranslations)

// reading yaml files recursively, per-locale
_.each(glob.sync(`${__dirname}/**/*.yml`), (path) => {
  let fileYamlContent = yaml.safeLoad(fs.readFileSync(path, 'utf8'))

  _.merge(translations, fileYamlContent)
})


module.exports = translations
