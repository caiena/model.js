import _    from '@caiena/lodash-ext'
import User from './user'


class Admin extends User {
  static get attrs() {
    return _.chain(super.attrs)
      .concat(['area'])
      .uniq()
      .value()
  }

  static get constraints() {
    return _.merge({}, super.constraints, {
      area: { presence: true }
    })
  }

  // do not use constructor()
  // if you need extra functionality, use $init()
  $init(props, options) {
    // default value
    if (!_.has(props, 'status')) { // no value provided
      this.status = 'success'
    }

    // overriding attr setter
    Object.defineProperty(this, 'name', {
      get() { return this.$attrs['name'] },
      set(val) { return this.$attrs['name'] = _.blank(val) ? val : `admin:${val}` },
      configurable: true,
      enumerable:   true
    })
  }


  // overriding virtual getter
  get disabled() {
    return super.disabled || this.status == 'failure'
  }
}


export default Admin
