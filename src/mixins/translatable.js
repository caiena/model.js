import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'


function Translatable(Class) {
  class TranslatableClass extends Class {
    static get i18nScope() {
      return `models.${_.underscore(this.name)}`
    }

    static $tModelName({ count = 1 } = {}) {
      return i18n.t(this.i18nScope, { count })
    }

    static $tAttr(attrName, options = {}) {
      let scope = `${this.i18nScope}.attributes`
      return i18n.t(attrName, _.defaults({}, options, { scope }))
    }

    static $tEnum(enumName, enumValue = undefined, options = {}) {
      let scope = this.i18nScope
      let key = null

      if (enumValue === undefined) {
        // .attributes.${enumName}
        scope += '.attributes'
        key = enumName
      } else {
        // .enums.${enumName}.${enumValue}
        scope += `.enums.${enumName}`
        key = enumValue
      }

      return i18n.t(key, _.defaults({}, options, { scope }))
    }

    // TODO: localize attribute
    // $l(attrName) {
    //  // checkout type definition for date or datetime
    //  // use $l('date', attrName)
    //  // or  $l('time', attrName)
    // }
  }

  return TranslatableClass
}


export default Translatable
