import _    from '@caiena/lodash-ext'
import User from './user'


class Admin extends User {

  static get relations() {
    return {
      auditingPurchases: { type: 'hasMany',   model: 'Purchase' },
      createdBy:         { type: 'belongsTo', model: Admin }
    }
  }

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
  // if you need extra functionality, use $afterInit(...args)
  $afterInit(...args) {
    // default value
    if (this.$blank('status')) {
      this.status = 'success'
    }
  }


  // overriding virtual getter
  get disabled() {
    return super.disabled || this.status === 'failure'
  }

  // overriding attr setter
  set name(val) {
    this.$attrs.name = _.blank(val) ? val : `[admin] ${val}`
  }
}


export default Admin
