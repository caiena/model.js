import _                     from '@caiena/lodash-ext'
import { writablePropNames } from './meta'
import mixin                 from './mixin'
import Attributable          from './mixins/attributable'
import Validatable           from './mixins/validatable'


class Base {
  static get attrs()    { return [] }
  static get virtuals() { return [] }
  static get enums()    { return {} }
}

class Model extends mixin(Base, [Attributable, Validatable]) {
  // using "props" as name to make it explicit that we'll set any enumerable "property" in the instance
  // (JavaScript land - getOwnPropertyDescriptor() and prototype)
  constructor(props = {}, { undefs = true } = {}) {
    super()

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

    // set props, one-by-one
    _.each(sanitizedProps, (value, name) => {
      this[name] = value
    })
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

  $serialize(...args) {
    return this.toJSON(...args)
  }
}


export default Model
