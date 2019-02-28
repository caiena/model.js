import validate from 'validate.js'
import _        from '@caiena/lodash-ext'

// XXX overwriting presence validator.
//
function presence(value, options, key, attrs) {
  let opts = _.merge({}, this.options, options)

  if (_.blank(value)) {
    return opts.message || this.message || "can't be blank";
  }

  // returning nothing means "is valid"
}

validate.validators.presence = presence

export default presence
