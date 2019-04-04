import _     from '@caiena/lodash-ext'
import Model from '../../../../src/model'

import Purchase from './purchase'


class User extends Model {

  static get relations() {
    return {
      createdBy: { type: 'belongsTo', model: 'Admin'  },
      photo:     { type: 'hasOne',    model: 'Photo'  },
      purchases: { type: 'hasMany',   model: Purchase },
    }
  }

  static get enums() {
    return {
      status: { failure: -1, scheduled: 0, success: 1 }
    }
  }

  static get attrs() {
    return [
      // fks
      'photoId',

      // enums
      'status',

      // attrs
      'id',
      'name',
      'disabledAt'
    ]
  }

  static get virtuals() {
    return ['disabled']
  }

  static get constraints() {
    return {
      name:   { presence: true },
      status: { inclusion: this.$enums.status.keys }
    }
  }


  // methods
  // ----
  get disabled() {
    return _.present(this.disabledAt)
  }
}


export default User
