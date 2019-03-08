// a "boot" script - entrypoint
import _ from '@caiena/lodash-ext'
import Model from '../../../src/model'

import Admin from './models/admin'
import Purchase from './models/purchase'
import User from './models/user'


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
