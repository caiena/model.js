import _         from '@caiena/lodash-ext'
import { i18n }  from '@caiena/i18n'
import mixin     from '../../../../src/mixin'
import Decorator from '../../../../src/mixins/decorator'
import Purchase  from '../models/purchase'


class PurchaseDecorator extends mixin(Purchase, [Decorator]) {

  get createdAt() {
    if (this.$object.$blank('createdAt')) return null

    return i18n.l('date.formats.long', this.$object.createdAt)
  }

}


export default PurchaseDecorator
