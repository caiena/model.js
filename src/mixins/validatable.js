import _        from '@caiena/lodash-ext'
import validate from 'validate.js'
import '../validators/register'


// TODO: remove this class
class ValidationError extends Error {
  constructor(errors) {
    super('validation error')
    Error.captureStackTrace(this, this.constructor) // Creates the this.stack getter

    this.name = 'ValidationError'
    this.errors = errors
  }
}


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

  // TODO: probably not needed, because mixins are used like:
  // class MyClass extends Mixin(BaseClass)
  // -> so MyClass will always be named MyClass :)
  // XXX: ensuring the class name stays untouched
  // Object.defineProperty(ValidatableClass, 'name', { value: Class.name })

  return ValidatableClass
}


export default Validatable
export { Validatable, ValidationError }
