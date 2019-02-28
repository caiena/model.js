import _    from '@caiena/lodash-ext'
import Enum from '@caiena/enum'


function defineAttr(attrName, prototype) {
  Object.defineProperty(prototype, attrName, {
    get() {
      return this.$attrs[attrName]
    },
    set(value) {
      return this.$attrs[attrName] = value
    }
    // configurable: false,
    // enumerable:   true
  })
}

function defineEnum(enumName, prototype) {
  Object.defineProperty(prototype, enumName, {
    get() {
      return this.$attrs[enumName]
    },
    set(value) {
      // ensures setting the key as attr value
      let key = this.constructor.enums[enumName].key(value)
      return this.$attrs[enumName] = key
    }
    // configurable: false,
    // enumerable:   true
  })
}




// decorator style
function model(Class) {
  const meta = {
    class: {
      enums: null
    },
  }


  // TODO: sanity check?
  // if (!(Class.prototype instanceof Base)) {
  //   throw 'invalid model class.'
  // }

  // TODO: sanity check?
  // - avoid clash of attrs, enums and virtuals "prop names"

  class ModelClass extends Class {
    // overriding enums, transforming objects to structured Enums
    static get enums() {
      if (meta.class.enums) return meta.class.enums

      return meta.class.enums = _.reduce(super.enums, (result, enumeration, name) => {
        // converting object to structured Enum
        result[name] = new Enum(enumeration)

        return result
      }, {})
    }
  }
  // keeping class name
  Object.defineProperty(ModelClass, 'name', { value: Class.name })


  // handling enums first then attrs, avoiding overrides
  // defining enums get/set properties
  _.each(ModelClass.enums, (enumeration, enumName) => {
    // TODO: should it be _.hasIn(), including inherited props?
    if (!_.has(ModelClass.prototype, enumName)) {
      defineEnum(enumName, ModelClass.prototype)
    }
  })

  // defining attrs get/set properties
  _.each(ModelClass.attrs, (attrName) => {
    // TODO: should it be _.hasIn(), including inherited props?
    if (!_.has(ModelClass.prototype, attrName)) {
      defineAttr(attrName, ModelClass.prototype)
    }
  })


  return ModelClass
}


export default model
