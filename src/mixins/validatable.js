import _        from '@caiena/lodash-ext'
import validate from 'validate.js'
import '../validators/register'


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
        // TODO: use this instead of this.$props
        validate.async(this.$props, constraints)
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
