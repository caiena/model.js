// utility function for metaprogramming

import _ from '@caiena/lodash-ext'


function defineInternalProp(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    writable: true,
    configurable: true,
    value
  })
}


// checks for property in instance or its prototype
function writableProp(instance, name) {
  // avoiding reserved props (e.g. constructor) or names starting with $ - model.js "meta" props
  if (_.includes(['constructor'], name) || _.startsWith(name, '$')) return false

  let descriptor = null

  if (instance.hasOwnProperty(name)) {
    descriptor = Object.getOwnPropertyDescriptor(instance, name)
  } else {
    // falling back to prototype
    let prototype = Object.getPrototypeOf(instance)
    descriptor = Object.getOwnPropertyDescriptor(prototype, name)
  }

  // XXX: we're considering "writableProp" a prop that is defined as get/set and
  // has a setter method!
  return !!descriptor.set
}


// checks for property in instance or its prototype
function writablePropNames(instance) {
  let prototype = Object.getPrototypeOf(instance)
  let propNames = _.chain(Object.getOwnPropertyNames(instance))
    .concat(Object.getOwnPropertyNames(prototype))
    .uniq()
    .value()
    .sort()

  return _.filter(propNames, (name) => writableProp(instance, name))
}


// can't export default and import named destructuring. So we're exporting named (non-default).
// https://github.com/babel/babel-loader/issues/194
export {
  defineInternalProp,
  writableProp,
  writablePropNames
}
