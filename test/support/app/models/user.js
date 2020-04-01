import _      from '@caiena/lodash-ext'
import moment from 'moment'

import Model  from '../../../../src/model'
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
      'passwordHash',
      'disabledAt'
    ]
  }

  static get virtuals() {
    return [
      'disabled',
      'password'
    ]
  }

  static get constraints() {
    return {
      name:   { presence: true, type: 'string' },
      status: { inclusion: this.$enums.status.keys }
    }
  }


  // methods
  // ----
  get disabled() {
    return _.present(this.disabledAt)
  }

  set disabled(value) {
    if (!!value) {
      this.disabledAt = moment().format('YYYY-MM-DD')
    } else {
      this.disabledAt = null
    }
  }

  // XXX: this method (function) is here to make sure "methods" work on model.js
  wasDisabledBefore(datetime) {
    if (this.$blank("disabledAt")) return false

    return moment(this.disabledAt).isBefore(moment(datetime))
  }
}


export default User
