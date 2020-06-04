import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import { defineInternalProp } from '../meta'
import validate from 'validate.js'
import '../validators/register'


// custom error formatter, creating a code/values interpolation scheme with i18n
// @see http://validatejs.org/#validate-error-formatting
function transformErrors(i18nScope, errors) {
  // errors sample:
  // // => [
  //   {
  //     "attribute": "username",
  //     "value": "nicklas",
  //     "validator": "exclusion",
  //     "globalOptions": {
  //       "format": "detailed"
  //     },
  //     "attributes": {
  //       "username": "nicklas",
  //       "password": "bad"
  //     },
  //     "options": {
  //       "within": [
  //         "nicklas"
  //       ],
  //       "message": "'%{value}' is not allowed"
  //     },
  //     "error": "Username 'nicklas' is not allowed"
  //   },
  //   {
  //     "attribute": "password",
  //     "value": "bad",
  //     "validator": "length",
  //     "globalOptions": {
  //       "format": "detailed"
  //     },
  //     "attributes": {
  //       "username": "nicklas",
  //       "password": "bad"
  //     },
  //     "options": {
  //       "minimum": 6,
  //       "message": "must be at least 6 characters"
  //     },
  //     "error": "Password must be at least 6 characters"
  //   }
  // ]
  errors = validate.groupErrorsByAttribute(errors)
  let transformedErrors = {}

  for (let attr in errors) {
    transformedErrors[attr] = []

    for (let error of errors[attr]) {
      let code = error.validator
      let message = _.get(error, 'options.message') ||
        i18n.t(`errors.${code}`, {
          scope: i18nScope,
          defaultValue: i18n.t(`errors.${code}`),
          value: error.value
        })

      transformedErrors[attr].push({
        attribute: error.attribute,
        value: error.value,
        code,
        message
      })
    }
  }

  return transformedErrors
}

function Validatable(Class) {

  class ValidatableClass extends Class {

    constructor(...args) {
      super(...args)
      defineInternalProp(this, '$$errors', {})
    }

    get $errors() {
      return this.$$errors
    }

    static get $constraints() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$constraints')) {
        this.$$constraints = _.clone(this.constraints)
      }

      return this.$$constraints
    }

    async $validateModel() {
      let constraints = this.constructor.constraints
      let instance = this

      // adapting api to .then(success, error) to .then(success).catch(error)
      return new Promise((resolve, reject) => {
        // - cleanAttributes: false - to tell validatejs not to delete empty or without constraint attributes
        // @see https://validatejs.org/#validate-async
        //   > Besides accepting all options as the non async validation function it also accepts
        //   > two additional options; cleanAttributes which, unless false, makes validate.async
        //   > call validate.cleanAttributes before resolving the promise (...)
        // @see https://validatejs.org/#utilities-clean-attributes
        validate.async(this, constraints, { format: 'detailed', cleanAttributes: false })
          .then(
            function success(attributes) {
              // reset errors
              instance.$$errors = {}
              resolve(true)
            },

            function error(errors) {
              if (errors instanceof Error) {
                // runtime Error. Just throw it
                // reset errors
                instance.$$errors = {}
                reject(errors)
              } else {
                // validation error.
                // assign to $errors
                instance.$$errors = transformErrors(instance.constructor.i18nScope, errors)
                resolve(false)
              }
            })
      })
    }

    async $validate({ relations = false } = {}) {
      let instance = this
      let modelPromise = instance.$validateModel()

      if (!relations) {
        return modelPromise
      }

      let relationsKeys = Object.keys(instance.$relations)
      let modelRelations = _.pickBy(instance, function (value, key) {
        return relationsKeys.includes(key) && _.present(value)
      })

      let promises = [modelPromise]

      _.each(modelRelations, (value, key) => {

        if (Array.isArray(value)) {
          let relationPromises = value.map(relation => relation.$validateModel())
          promises = [...promises, ...relationPromises]

        } else {
          promises.push(value.$validateModel())
        }
      })

      try {
        let responses = await Promise.all(promises)
        let hasErrors = responses.includes(false)

        return hasErrors ? Promise.resolve(false) : Promise.resolve(true)

      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  return ValidatableClass
}


export default Validatable
