import _ from '@caiena/lodash-ext'
import Model from '../model'


function Decorator(ModelClass) {

  class DecoratedClass extends ModelClass {
    static get $modelClass() { return ModelClass }

    constructor(object) {
      let _object = (object instanceof Model) ? object : new ModelClass(object)

      // sanity check
      if (_object.hasOwnProperty('$object')) {
        throw new Error('Decorated object cannot have a property named "$object"')
      }

      super({ $object: _object, ..._object.$props })
    }

    // hook to define $object before constructing the model instance
    $beforeInit(props, opts) {
      this.$object = props.$object

      super.$beforeInit(props, opts)
    }
  }

  return DecoratedClass
}


export default Decorator
