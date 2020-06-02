import _                     from '@caiena/lodash-ext'
import { writablePropNames } from './meta'
import mixin                 from './mixin'
import Attributable          from './mixins/attributable'
import Relatable             from './mixins/relatable'
import Translatable          from './mixins/translatable'
import Validatable           from './mixins/validatable'

function _serializeObject(obj) {
  return _.reduce(obj, (serialized, value, key) => {
    serialized[key] = _serialize(value)
    return serialized
  }, {})
}

function _serialize(value) {
  if (Array.isArray(value)) return value.map(_serialize)

  if (_.isObjectLike(value)) {
    return (typeof value.toJSON === 'function') ? value.toJSON() : _serializeObject(value)
  }

  return value
}

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


    if (virtuals) {
      _.merge(json, _.pick(this, this.constructor.virtuals))
    }

    if (relations) {
      let  modelRelations = Object.keys(this.$relations)
      _.merge(json, _.pick(this, modelRelations))
    }

    if (_.present(pick)) {
      json = _.pick(json, pick)
    }

    if (_.present(include)) {
      json = _.merge(json, _.pick(this, include))
    }

    if (_.present(omit)) {
      json = _.omit(json, omit)
    }

    if (!undefs) {
      json = _.pickBy(json, (val, key) => !_.isUndefined(val))
    }

    json = _.reduce(json, (serialized, value, propName) => {
      serialized[propName] = _serialize(value)

      return serialized
    }, {})


    return json
  }

  $serialize(...args) {
    return this.toJSON(...args)
  }
}


export default Model
