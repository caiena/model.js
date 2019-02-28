import _ from '@caiena/lodash-ext'


// decorator style
function Decorator(modelInstanceOrClass) {
  let decorated = null

  if (typeof modelInstanceOrClass === 'function') {
    // arg is a class/function
  } else {
    // arg is a model instance
  }

  return decorated
}


export default Decorator
