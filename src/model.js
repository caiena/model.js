import _                     from '@caiena/lodash-ext'
import { writablePropNames } from './meta'
import mixin                 from './mixin'
import Attributable          from './mixins/attributable'
import Relatable             from './mixins/relatable'
import Translatable          from './mixins/translatable'
import Validatable           from './mixins/validatable'


class Base {
  static get $modelNameAdapter() { return _.camelize }
  static get $modelName()        { return this.$modelNameAdapter(this.name) }

  static get attrs()     { return [] }
  static get enums()     { return {} }
  static get virtuals()  { return [] }

  static $lookupModel(name) {
    throw new Error('Model.$lookupModel(name) is not implemented.')
  }
}

class Model extends mixin(Base, [Attributable, Relatable, Translatable, Validatable]) {
  static get $$model() { return true } // allow programmatically checking if it's a model class

  // using "props" as name to make it explicit that we'll set any enumerable "property" in the instance
  // (JavaScript land - getOwnPropertyDescriptor() and prototype)
  constructor(props = {}, { undefs = true } = {}) {
    super()

    this.$beforeInit(...arguments) // hook for user land

    let propNames = writablePropNames(this)
    let sanitizedProps = _.pick(props, propNames)

    if (undefs) {
      // start all props with undefined, allowing them to be observed (rxjs, Vue, ...)
      let undefProps = _.reduce(propNames, (undefProps, name) => {
        undefProps[name] = undefined
        return undefProps
      }, {})

      // adding undefs if not defined yet
      // _.defaults(sanitizedProps, undefProps)
      // XXX: using _.merge() here to keep properties names sorted
      sanitizedProps = _.merge(undefProps, sanitizedProps)
    }

    // set props, one-by-one, using setter method
    _.each(sanitizedProps, (value, name) => {
      this[name] = value
    })

    this.$afterInit(...arguments) // hook for user land
  }

  $beforeInit(...args) {
    // override it in subclasses
  }

  $afterInit(...args) {
    // override it in subclasses
  }

  toJSON({ pick = [], include = [], omit = [], virtuals = false, relations = false, undefs = false } = {}) {
    let json = _.clone(this.$attrs)

    if (!undefs) {
      json = _.pickBy(json, (val, key) => !_.isUndefined(val))
    }

    if (virtuals) {
      _.merge(json, _.pick(this, this.constructor.virtuals))
    }

    if (relations) { // TODO: test it
      _.merge(json, _.pick(this, this.constructor.$relations))
    }

    if (_.present(pick)) {
      json = _.pick(json, pick)
    }

    if (_.present(include)) {
      const includedFields = include.reduce((parsedFields, key) => {
        const field = this[key]

        if (Array.isArray(field)) {
          parsedFields[key] = field.map(rel => rel.toJSON())

        } else if (_.present(field)) {
          parsedFields[key] = field.toJSON()

        } else {
          parsedFields[key] = field
        }

        return parsedFields
      }, {})

      Object.assign(json, includedFields)
    }

    if (_.present(omit)) {
      json = _.omit(json, omit)
    }

    return json
  }

  $serialize(...args) {
    return this.toJSON(...args)
  }
}


export default Model
