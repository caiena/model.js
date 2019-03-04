import _     from '@caiena/lodash-ext'
import Model from '../../../src/model'


class User extends Model {
  static get attrs() {
    return ['id', 'name', 'status', 'disabledAt']
  }

  static get virtuals() {
    return ['disabled', 'shortname']
  }

  static get enums() {
    return {
      status: { failure: -1, scheduled: 0, success: 1 }
    }
  }

  static get constraints() {
    return {
      name: { presence: true }
    }
  }

  get disabled() {
    return _.present(this.disabledAt)
  }

  get shortname() {
    if (this.$blank('name')) return ''

    let names = this.name.split(/\s+/)
    return names.length > 1 ? `${names[0]} ${names.pop()}` : `${names[0]}`
  }
}

export default User
