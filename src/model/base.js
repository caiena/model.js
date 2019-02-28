import _           from '@caiena/lodash-ext'
import mixin       from '../mixin'
import Validatable from '../mixins/validatable'


function $writableProp(instance, name) {
  // avoiding reserved props (e.g. constructor) or names starting with $ - model.js "meta" props
  if (_.includes(['constructor'], name) || _.startsWith(name, '$')) return false

  // in model.js, props are defined on the prototype
  let prototype = Object.getPrototypeOf(instance)
  let propDescriptor = Object.getOwnPropertyDescriptor(prototype, name)

  return propDescriptor.set || (propDescriptor.writable !== false)
}

function $writablePropNames(instance) {
  // in model.js, props are defined on the prototype
  let prototype = Object.getPrototypeOf(instance)
  let propNames = Object.getOwnPropertyNames(prototype)

  return _.filter(propNames, (name) => $writableProp(instance, name)).sort()
}


class Data {
  constructor() {
    this.$$attrs = {}
  }

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
}

class Base extends mixin(Data, Validatable) {
  static get attrs() { return [] }
  static get virtuals() { return [] }
  static get enums() { return {} }
  static get constraints() { return {} }

  constructor(props = {}, { undefs = true } = {}) {
    super() // XXX: Data constructor...

    let writablePropNames = $writablePropNames(this)
    let sanitizedProps = _.pick(props, writablePropNames)

    if (undefs) {
      // start all props with undefined, allowing them to be observed (rxjs, Vue, ...)
      let undefProps = _.reduce(writablePropNames, (undefProps, name) => {
        undefProps[name] = undefined
        return undefProps
      }, {})

      // adding undefs if not defined yet
      // _.defaults(sanitizedProps, undefProps)
      // XXX: using _.merge() here to keep properties names sorted
      sanitizedProps = _.merge(undefProps, sanitizedProps)
    }


    _.each(sanitizedProps, (value, name) => {
      this[name] = value
    })

    // this.initialize()
  }

  initialize() {
    // override in super class to inject behaviour
    // TODO: is it necessary?
  }

  get $attrs() {
    // XXX: $attrs and $$attrs will be confusing...
    return this.$$attrs
  }

  set $attrs(attrs) {
    return _.merge(this.$$attrs, attrs)
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

  $set(attrNameOrPath, value) {
    return _.set(this, attrNameOrPath, value)
  }

  toJSON({ pick = [], omit = [], virtuals = false, undefs = false } = {}) {
    let json = _.clone(this.$attrs)

    if (!undefs) {
      json = _.pickBy(json, (val, key) => !_.isUndefined(val))
    }

    if (virtuals) {
      _.merge(json, _.pick(this, this.constructor.virtuals))
    }

    if (_.present(omit)) {
      json = _.omit(json, omit)
    }

    if (_.present(pick)) {
      json = _.pick(json, pick)
    }

    return json
  }
  // TODO: alias $serialize() => toJSON()?
}


export default Base
