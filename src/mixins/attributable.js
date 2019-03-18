import _                      from '@caiena/lodash-ext'
import Enum                   from '@caiena/enum'
import mixin                  from '../mixin'
import { defineInternalProp, writablePropNames } from '../meta'



function defineAttr(obj, attrName, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$attrs[attrName]
    }
  }

  if (!set) {
    set = function set(value) {
      return this.$attrs[attrName] = value
    }
  }

  Object.defineProperty(obj, attrName, {
    get,
    set,
    configurable: true,
    enumerable:   true
  })
}

function defineEnum(obj, enumName, { get = null, set = null } = {}) {
  // custom setter for enums
  if (!set) {
    set = function set(value) {
      // ensures setting the key as attr value
      let key = this.constructor.$enums[enumName].key(value)
      return this.$attrs[enumName] = key
    }
  }

  defineAttr(obj, enumName, { get, set })
}



function Attributable(Class) {

  class AttributableClass extends Class {

    // lazy evaluated $enums, using @caiena/enum
    static get $enums() {
      return this.$$enums = this.$$enums || _.reduce(this.enums, (result, enumeration, enumName) => {
        if (enumeration instanceof Enum) {
          result[enumName] = enumeration
        } else {
          result[enumName] = new Enum(enumeration)
        }

        return result
      }, {})
    }

    // lazy evaluated $attrs
    // for now we're only keeping the API consistent, adding a '$methodName' getter
    // TODO: define types and create "intelligent" setters? (with constraints)
    static get $attrs() {
      return this.$$attrs = this.$$attrs || _.clone(this.attrs)
    }

    constructor(...args) {
      super(...args)

      let klass = this.constructor

      defineInternalProp(this, '$$attrs', {})

      // handling enums first then attrs, avoiding overrides
      // defining enums get/set properties
      _.each(klass.enums, (enumeration, enumName) => {
        // sanity check!
        // enum must be defined in attrs list as well
        if (!_.includes(klass.attrs, enumName)) {
          throw new Error(`enum "${enumName}" is not listed as an attribute in model ${klass.name}`)
        }

        if (!_.has(this, enumName)) {
          // first, check if it is defined in prototype
          if (_.hasIn(this, enumName)) {
            let _proto = Object.getPrototypeOf(this)
            let _descr = Object.getOwnPropertyDescriptor(_proto, enumName)
            defineEnum(this, enumName, { get: _descr.get, set: _descr.set })
          } else {
            defineEnum(this, enumName)
          }
        }
      })

      // defining attrs get/set properties
      _.each(klass.attrs, (attrName) => {
        if (!_.has(this, attrName)) {
          // first, check if it is defined in prototype
          if (_.hasIn(this, attrName)) {
            let _proto = Object.getPrototypeOf(this)
            let _descr = Object.getOwnPropertyDescriptor(_proto, attrName)
            defineAttr(this, attrName, { get: _descr.get, set: _descr.set })
          } else {
            defineAttr(this, attrName)
          }
        }
      })
    }

    get $attrs() {
      // XXX: $attrs and $$attrs will be confusing...
      return this.$$attrs
    }

    set $attrs(attrs) {
      // TODO: remove old code
      // return _.merge(this.$$attrs, attrs)

      // set props, one-by-one, using setter method
      let sanitizedAttrs = _.pick(attrs, this.constructor.attrs)
      _.each(sanitizedAttrs, (value, name) => {
        this[name] = value
      })
    }

    // TODO: remove it?
    get $props() {
      let instance = this
      let proto = Object.getPrototypeOf(this)
      let propNames = _.chain(Object.getOwnPropertyNames(proto))
        .concat(Object.getOwnPropertyNames(instance))
        .filter((name) => !(_.includes(['constructor'], name) || _.startsWith(name, '$')))
        .uniq()
        .value()
        .sort()

      return _.reduce(propNames, (props, propName) => {
        props[propName] = this[propName]
        return props
      }, {})
    }

    $blank(attrNameOrPath) {
      return _.blank(this.$get(attrNameOrPath))
    }

    $enumValue(enumName) {
      return this.constructor.$enums[enumName].value(this[enumName])
    }

    $get(attrNameOrPath) {
      return _.get(this, attrNameOrPath)
    }

    $has(attrNameOrPath) {
      // TODO: should it be _.hasIn(), to include inherited properties?
      return _.has(this, attrNameOrPath)
    }

    $pick(...attrNamesOrPathes) {
      return _.pick(this, ...attrNamesOrPathes)
    }

    $present(attrNameOrPath) {
      return _.present(this.$get(attrNameOrPath))
    }

    $set(attrNameOrPath, value) {
      return _.set(this, attrNameOrPath, value)
    }
  }

  return AttributableClass
}


export default Attributable
