import _ from '@caiena/lodash-ext'
import mixin     from '../../../../src/mixin'
// import Model from '../../../../src/model'
import Decorator from '../../../../src/mixins/decorator'
import Admin from '../models/admin'


class AdminDecorator extends mixin(Admin, [Decorator]) {

  get createdBy() {
    return this.$object.$get('createdBy.name')
  }

}


export default AdminDecorator
