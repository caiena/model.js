import validate from 'validate.js'
import _        from '@caiena/lodash-ext'
import { isValid } from '@fnando/cpf'

function cpf(value, options, key, attrs) {
  let opts = _.merge({}, this.options, options)

  if (!isValid(value)) {
    return opts.message || this.message || "is not a valid CPF";
  }

  // returning nothing means "is valid"
}

validate.validators.cpf = cpf

export default cpf
