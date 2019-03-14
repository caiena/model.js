// a "boot" script - entrypoint
import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Model    from '../../../src/model'

import translations from './config/i18n/translations'

import Admin from './models/admin'
import Purchase from './models/purchase'
import User from './models/user'


// initializing i18n
i18n.init({ locales: ['pt-BR', 'en-US'], defaultLocale: 'pt-BR', translations })


// we're providing a default $lookupModel() using a global variable "mapping" all models.
const $models = {
  Admin,
  Purchase,
  User
}

// exporting globally
global.$models = $models


// overriding the lookup method
_.assign(Model, {
  $lookupModel(nameOrPath) {
    return _.get($models, nameOrPath)
  }
})


export { $models }
