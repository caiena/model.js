import _                      from '@caiena/lodash-ext'
import Enum                   from '@caiena/enum'
import mixin                  from '../mixin'
import { defineInternalProp, writablePropNames } from '../meta'



function defineAttr(obj, attrName) {
  Object.defineProperty(obj, attrName, {
    get() {
      return this.$attrs[attrName]
    },
    set(value) {
      return this.$attrs[attrName] = value
    },
    configurable: false,
    enumerable:   true
  })
}

function defineEnum(obj, enumName, enumeration) {
  const _enum = new Enum(enumeration)
  let Class = obj.constructor

  if (!_.has(Class, '$enums'))
    defineInternalProp(Class, '$enums', {})

  if (!_.has(Class.$enums[enumName]))
    Class.$enums[enumName] = new Enum(enumeration)

  Object.defineProperty(obj, enumName, {
    get() {
      return this.$attrs[enumName]
    },
    set(value) {
      // ensures setting the key as attr value
      let key = this.constructor.$enums[enumName].key(value)
      return this.$attrs[enumName] = key
    },
    configurable: false,
    enumerable:   true
  })
}



function Attributable(Class) {

  class AttributableClass extends Class {
    constructor(...args) {
      super(...args)

      let klass = this.constructor

      defineInternalProp(this, '$$attrs', {})

      // handling enums first then attrs, avoiding overrides
      // defining enums get/set properties
      _.each(klass.enums, (enumeration, enumName) => {
        // TODO: should it be _.hasIn(), including inherited props?
        if (!_.has(this, enumName)) {
          defineEnum(this, enumName, enumeration)
        }
      })

      // defining attrs get/set properties
      _.each(klass.attrs, (attrName) => {
        // TODO: should it be _.hasIn(), including inherited props?
        if (!_.has(this, attrName)) {
          defineAttr(this, attrName)
        }
      })
    }

    get $attrs() {
      // XXX: $attrs and $$attrs will be confusing...
      return this.$$attrs
    }

    set $attrs(attrs) {
      return _.merge(this.$$attrs, attrs)
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
