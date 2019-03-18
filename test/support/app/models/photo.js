import _     from '@caiena/lodash-ext'
import Model from '../../../../src/model'

import User from './user'


class Photo extends Model {
  static get attrs() {
    return ['id', 'filename', 'mimetype', 'size']
  }

  // static get virtuals()

  // static get enums()

  static get relations() {
    return {
      user: { type: 'belongsTo', model: User }
    }
  }

  static get constraints() {
    return {
      filename: { presence: true },
      size:     { numericality: { onlyInteger: true, greaterThan: 0 } }
    }
  }
}

export default Photo
