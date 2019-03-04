import _     from '@caiena/lodash-ext'
import Model from '../../../../src/model'


class User extends Model {
  static get attrs() {
    return ['id', 'name', 'status', 'disabledAt']
  }

  static get virtuals() {
    return ['disabled']
  }

  static get enums() {
    return {
      status: { failure: -1, scheduled: 0, success: 1 }
    }
  }

  static get constraints() {
    return {
      name:   { presence: true },
      status: { inclusion: this.$enums.status.keys }
    }
  }

  get disabled() {
    return _.present(this.disabledAt)
  }
}

export default User
