import _ from '@caiena/lodash-ext'
import mixin     from '../../../../src/mixin'
// import Model from '../../../../src/model'
import Decorator from '../../../../src/mixins/decorator'
import User from '../models/user'


class UserDecorator extends mixin(User, [Decorator]) {

  get photoUrl() {
    if (this.$blank('photoId')) return null

    return `/photos/${this.photoId}`
  }

}


export default UserDecorator
