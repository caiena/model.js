import _                      from '@caiena/lodash-ext'
import mixin                  from '../mixin'
import { defineInternalProp, writablePropNames } from '../meta'



function belongsTo(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName]
    }
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null

    if (config.model.$$model) { // check if is a model class without circular dependency
      ModelClass = config.model
    } else if (typeof config.model === 'string') { // use lookup
      ModelClass = instance.constructor.$lookupModel(config.model)
    } else if (typeof config.model === 'function') { // check if is a callable (function)
      ModelClass = config.model()
    } else {
      ModelClass = config.model // default: assign it as a model class
    }

    set = function set(value) {
      if (value == null) { // null or undefined
        return this.$relations[relationName] = value
      }

      if (_.isArray(value)) throw new Error("can't assign an array to a belongsTo relation")

      // TODO: should we assign values to fks? `${relation}_id``

      if (value instanceof ModelClass) {
        return this.$relations[relationName] = value
      } else {
        // construct model instance with value as attributes
        return this.$relations[relationName] = new ModelClass(value)
      }
    }
  }

  Object.defineProperty(instance, relationName, {
    get,
    set,
    configurable: true,
    enumerable:   true
  })
}


function hasOne(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName]
    }
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null

    if (config.model.$$model) { // check if is a model class without circular dependency
      ModelClass = config.model
    } else if (typeof config.model === 'string') { // use lookup
      ModelClass = instance.constructor.$lookupModel(config.model)
    } else if (typeof config.model === 'function') { // check if is a callable (function)
      ModelClass = config.model()
    } else {
      ModelClass = config.model // default: assign it as a model class
    }

    set = function set(value) {
      if (value == null) { // null or undefined
        return this.$relations[relationName] = value
      }

      if (_.isArray(value)) throw new Error("can't assign an array to a hasOne relation")

      if (value instanceof ModelClass) {
        return this.$relations[relationName] = value
      } else {
        // construct model instance with value as attributes
        return this.$relations[relationName] = new ModelClass(value)
      }
    }
  }

  Object.defineProperty(instance, relationName, {
    get,
    set,
    configurable: true,
    enumerable:   true
  })
}


function hasMany(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName]
    }
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null

    if (config.model.$$model) { // check if is a model class without circular dependency
      ModelClass = config.model
    } else if (typeof config.model === 'string') { // use lookup
      ModelClass = instance.constructor.$lookupModel(config.model)
    } else if (typeof config.model === 'function') { // check if is a callable (function)
      ModelClass = config.model()
    } else {
      ModelClass = config.model // default: assign it as a model class
    }

    set = function set(values) {
      if (values == null) { // null or undefined
        return this.$relations[relationName] = []
      }

      if (!_.isArray(values)) throw new Error("can't assign a non-array value to a hasMany relation")

      // TODO: should we assign values to fks? `${relation}_id`

      let modelInstances = _.map(values, (value) => {
        return value instanceof ModelClass ? value : new ModelClass(value)
      })

      return this.$relations[relationName] = modelInstances
    }
  }

  Object.defineProperty(instance, relationName, {
    get,
    set,
    configurable: true,
    enumerable:   true
  })
}


function defineRelation(instance, relationName, config, { get, set } = {}) {
  switch (config.type) {
    case 'belongsTo': return belongsTo(...arguments)
    case 'hasMany':   return hasMany(...arguments)
    case 'hasOne':    return hasOne(...arguments)
    default: {
      throw new Error(`Unknown relation type "${type}"`)
    }
  }
}



function Relatable(Class) {

  class RelatableClass extends Class {

    // lazy evaluated $relations
    static get $relations() {
      return this.$$relations = this.$$relations || _.reduce(this.relations, (result, config, name) => {
        result[name] = config
        return result
      }, {})
    }


    constructor(...args) {
      super(...args)

      let klass = this.constructor

      defineInternalProp(this, '$$relations', {})

      // defining relations get/set properties
      _.each(klass.relations, (config, relationName) => {
        if (!_.has(this, relationName)) {
          // first, check if it is defined in prototype
          if (_.hasIn(this, relationName)) {
            let _proto = Object.getPrototypeOf(this)
            let _descr = Object.getOwnPropertyDescriptor(_proto, relationName)
            defineRelation(this, relationName, config, { get: _descr.get, set: _descr.set })
          } else {
            defineRelation(this, relationName, config)
          }
        }
      })
    }

    get $relations() {
      // XXX: $relations and $$relations will be confusing...
      return this.$$relations
    }
  }

  return RelatableClass
}


export default Relatable
