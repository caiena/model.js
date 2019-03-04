import _        from '@caiena/lodash-ext'
import validate from 'validate.js'
import _validators from '../validators'


function Validatable(Class) {
  const meta = {
    instance: {
      $errors: {}
    }
  }

  class ValidatableClass extends Class {
    get $errors() {
      return meta.instance.$errors
    }

    async $validate() {
      let constraints = this.constructor.constraints

      // adapting api to .then(success, error) to .then(success).catch(error)
      return new Promise((resolve, reject) => {
        // - cleanAttributes: false - to tell validatejs not to delete empty or without constraint attributes
        // @see https://validatejs.org/#validate-async
        //   > Besides accepting all options as the non async validation function it also accepts
        //   > two additional options; cleanAttributes which, unless false, makes validate.async
        //   > call validate.cleanAttributes before resolving the promise (...)
        // @see https://validatejs.org/#utilities-clean-attributes
        validate.async(this, constraints, { cleanAttributes: false})
          .then(
            function success(attributes) {
              // reset errors
              meta.instance.$errors = {}
              resolve(true)
            },

            function error(errors) {
              if (errors instanceof Error) {
                // runtime Error. Just throw it
                // reset errors
                meta.instance.$errors = {}
                reject(errors)
              } else {
                // validation error.
                // assign to $errors
                meta.instance.$errors = errors
                resolve(false)
              }
            })
      })
    }
  }

  return ValidatableClass
}


export default Validatable
