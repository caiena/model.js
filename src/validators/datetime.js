// @see https://validatejs.org/#validators-datetime
// We're addming moment

import validate from 'validate.js'
import _        from '@caiena/lodash-ext'
import moment   from 'moment'


// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse(value, options) {
    // return +moment.utc(value)
    return moment.utc(value)
  },
  // Input is a unix timestamp
  format(value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss'
    return moment.utc(value).format(format)
  }
})


export default validate.validators.datetime
