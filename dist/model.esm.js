import _ from '@caiena/lodash-ext';
import Enum from '@caiena/enum';
import { i18n } from '@caiena/i18n';
import validate from 'validate.js';
import moment from 'moment';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// utility function for metaprogramming


function defineInternalProp(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value });

}


// checks for property in instance or its prototype
function writableProp(instance, name) {
  // avoiding reserved props (e.g. constructor) or names starting with $ - model.js "meta" props
  if (_.includes(['constructor'], name) || _.startsWith(name, '$')) return false;

  var descriptor = null;

  if (instance.hasOwnProperty(name)) {
    descriptor = Object.getOwnPropertyDescriptor(instance, name);
  } else {
    // falling back to prototype
    var prototype = Object.getPrototypeOf(instance);
    descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  }

  // XXX: we're considering "writableProp" a prop that is defined as get/set and
  // has a setter method!
  return !!descriptor.set;
}


// checks for property in instance or its prototype
function writablePropNames(instance) {
  var prototype = Object.getPrototypeOf(instance);
  var propNames = _.chain(Object.getOwnPropertyNames(instance)).
  concat(Object.getOwnPropertyNames(prototype)).
  uniq().
  value().
  sort();

  return _.filter(propNames, function (name) {return writableProp(instance, name);});
}

// @see https://github.com/Vincit/objection.js/blob/2f7dd232aec1b1b3d880d10e75b169af2554ea91/lib/utils/mixin.js


function mixin(Class, mixins) {
  return mixins.reduce(function (MixedClass, Mixin) {return Mixin(MixedClass);}, Class);
}

function defineAttr(obj, attrName) {var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},_ref$get = _ref.get,get = _ref$get === void 0 ? null : _ref$get,_ref$set = _ref.set,set = _ref$set === void 0 ? null : _ref$set;
  if (!get) {
    get = function get() {
      return this.$attrs[attrName];
    };
  }

  if (!set) {
    set = function set(value) {
      return this.$attrs[attrName] = value;
    };
  }

  Object.defineProperty(obj, attrName, {
    get: get,
    set: set,
    configurable: true,
    enumerable: true });

}

function defineEnum(obj, enumName) {var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},_ref2$get = _ref2.get,get = _ref2$get === void 0 ? null : _ref2$get,_ref2$set = _ref2.set,set = _ref2$set === void 0 ? null : _ref2$set;
  // custom setter for enums
  if (!set) {
    set = function set(value) {
      // accepts null value
      if (value === null) return this.$attrs[enumName] = null;

      // ensures setting the key as attr value
      var key = this.constructor.$enums[enumName].key(value);
      return this.$attrs[enumName] = key;
    };
  }

  defineAttr(obj, enumName, { get: get, set: set });
}



function Attributable(Class) {var

  AttributableClass = /*#__PURE__*/function (_Class) {_inherits(AttributableClass, _Class);var _super = _createSuper(AttributableClass);













































    function AttributableClass() {var _this;_classCallCheck(this, AttributableClass);for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      _this = _super.call.apply(_super, [this].concat(args));

      var klass = _this.constructor;

      defineInternalProp(_assertThisInitialized(_this), '$$attrs', {});

      // handling enums first then attrs, avoiding overrides
      // defining enums get/set properties
      _.each(klass.$enums, function (enumeration, enumName) {
        // sanity check!
        // enum must be defined in attrs list as well
        if (!_.includes(klass.$attrs, enumName)) {
          throw new Error("enum \"".concat(enumName, "\" is not listed as an attribute in model ").concat(klass.name));
        }

        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!_this.hasOwnProperty(enumName)) {
          // first, check if it is defined in prototype
          if (_this.constructor.prototype.hasOwnProperty(enumName)) {
            var _proto = Object.getPrototypeOf(_assertThisInitialized(_this));
            var _descr = Object.getOwnPropertyDescriptor(_proto, enumName);
            defineEnum(_assertThisInitialized(_this), enumName, { get: _descr.get, set: _descr.set });
          } else {
            defineEnum(_assertThisInitialized(_this), enumName);
          }
        }
      });

      // defining attrs get/set properties
      _.each(klass.$attrs, function (attrName) {
        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!_this.hasOwnProperty(attrName)) {
          // first, check if it is defined in prototype
          if (_this.constructor.prototype.hasOwnProperty(attrName)) {
            var _proto = Object.getPrototypeOf(_assertThisInitialized(_this));
            var _descr = Object.getOwnPropertyDescriptor(_proto, attrName);
            defineAttr(_assertThisInitialized(_this), attrName, { get: _descr.get, set: _descr.set });
          } else {
            defineAttr(_assertThisInitialized(_this), attrName);
          }
        }
      });return _this;
    }_createClass(AttributableClass, [{ key: "$attrs", get:

      function get() {
        // XXX: $attrs and $$attrs will be confusing...
        return this.$$attrs;
      }, set:

      function set(attrs) {var _this2 = this;
        // TODO: remove old code
        // return _.merge(this.$$attrs, attrs)

        // set props, one-by-one, using setter method
        var sanitizedAttrs = _.pick(attrs, this.constructor.$attrs);
        _.each(sanitizedAttrs, function (value, name) {
          _this2[name] = value;
        });
      }

      // TODO: remove it?
    }, { key: "$props", get: function get() {var _this3 = this;
        var instance = this;
        var proto = Object.getPrototypeOf(this);
        var propNames = _.chain(Object.getOwnPropertyNames(proto)).
        concat(Object.getOwnPropertyNames(instance)).
        filter(function (name) {return !(_.includes(['constructor'], name) || _.startsWith(name, '$'));}).
        uniq().
        value().
        sort();

        return _.reduce(propNames, function (props, propName) {
          props[propName] = _this3[propName];
          return props;
        }, {});
      } }, { key: "$blank", value:

      function $blank(attrNameOrPath) {
        return _.blank(this.$get(attrNameOrPath));
      } }, { key: "$enumValue", value:

      function $enumValue(enumName) {
        return this.constructor.$enums[enumName].value(this[enumName]);
      } }, { key: "$get", value:

      function $get(attrNameOrPath) {
        return _.get(this, attrNameOrPath);
      } }, { key: "$has", value:

      function $has(attrNameOrPath) {
        // TODO: should it be _.hasIn(), to include inherited properties?
        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for its exitence.
        // It can have side effects!
        return _.has(this, attrNameOrPath);
      } }, { key: "$pick", value:

      function $pick() {for (var _len2 = arguments.length, attrNamesOrPathes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {attrNamesOrPathes[_key2] = arguments[_key2];}
        return _.pick.apply(_, [this].concat(attrNamesOrPathes));
      } }, { key: "$present", value:

      function $present(attrNameOrPath) {
        return _.present(this.$get(attrNameOrPath));
      } }, { key: "$set", value:

      function $set(attrNameOrPath, value) {
        return _.set(this, attrNameOrPath, value);
      } }], [{ key: "$enums", get: // lazy evaluated $enums, using @caiena/enum
      function get() {// avoiding static property inheritance
        // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
        if (!this.hasOwnProperty('$$enums')) {this.$$enums = _.reduce(this.enums, function (result, enumeration, enumName) {// transform to Enum instance, if needed
            result[enumName] = enumeration instanceof Enum ? enumeration : new Enum(enumeration);return result;}, {});}return this.$$enums;} // lazy evaluated $attrs
      // for now we're only keeping the API consistent, adding a '$methodName' getter
      // TODO: define types and create "intelligent" setters? (with constraints)
    }, { key: "$attrs", get: function get() {// avoiding static property inheritance
        // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
        if (!this.hasOwnProperty('$$attrs')) {this.$$attrs = _.clone(this.attrs);}return this.$$attrs;} // lazy evaluated $virtuals
      // for now we're only keeping the API consistent, adding a '$methodName' getter
      // TODO: define types and create "intelligent" setters? (with constraints)
    }, { key: "$virtuals", get: function get() {// avoiding static property inheritance
        // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
        if (!this.hasOwnProperty('$$virtuals')) {this.$$virtuals = _.clone(this.virtuals);}return this.$$virtuals;} }]);return AttributableClass;}(Class);return AttributableClass;}

function belongsTo(instance, relationName, config) {var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},_ref$get = _ref.get,get = _ref$get === void 0 ? null : _ref$get,_ref$set = _ref.set,set = _ref$set === void 0 ? null : _ref$set;
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    var ModelClass = null;

    if (config.model.$$model) {// check if is a model class without circular dependency
      ModelClass = config.model;
    } else if (typeof config.model === 'string') {// use lookup
      ModelClass = instance.constructor.$lookupModel(config.model);
    } else if (typeof config.model === 'function') {// check if is a callable (function)
      ModelClass = config.model();
    } else {
      ModelClass = config.model; // default: assign it as a model class
    }

    set = function set(value) {
      if (value == null) {// null or undefined
        return this.$relations[relationName] = value;
      }

      if (_.isArray(value)) throw new Error("can't assign an array to a belongsTo relation");

      // TODO: should we assign values to fks? `${relation}_id``

      if (value instanceof ModelClass) {
        return this.$relations[relationName] = value;
      } else {
        // construct model instance with value as attributes
        return this.$relations[relationName] = new ModelClass(value);
      }
    };
  }

  Object.defineProperty(instance, relationName, {
    get: get,
    set: set,
    configurable: true,
    enumerable: true });

}


function hasOne(instance, relationName, config) {var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},_ref2$get = _ref2.get,get = _ref2$get === void 0 ? null : _ref2$get,_ref2$set = _ref2.set,set = _ref2$set === void 0 ? null : _ref2$set;
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    var ModelClass = null;

    if (config.model.$$model) {// check if is a model class without circular dependency
      ModelClass = config.model;
    } else if (typeof config.model === 'string') {// use lookup
      ModelClass = instance.constructor.$lookupModel(config.model);
    } else if (typeof config.model === 'function') {// check if is a callable (function)
      ModelClass = config.model();
    } else {
      ModelClass = config.model; // default: assign it as a model class
    }

    set = function set(value) {
      if (value == null) {// null or undefined
        return this.$relations[relationName] = value;
      }

      if (_.isArray(value)) throw new Error("can't assign an array to a hasOne relation");

      if (value instanceof ModelClass) {
        return this.$relations[relationName] = value;
      } else {
        // construct model instance with value as attributes
        return this.$relations[relationName] = new ModelClass(value);
      }
    };
  }

  Object.defineProperty(instance, relationName, {
    get: get,
    set: set,
    configurable: true,
    enumerable: true });

}


function hasMany(instance, relationName, config) {var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},_ref3$get = _ref3.get,get = _ref3$get === void 0 ? null : _ref3$get,_ref3$set = _ref3.set,set = _ref3$set === void 0 ? null : _ref3$set;
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    var ModelClass = null;

    if (config.model.$$model) {// check if is a model class without circular dependency
      ModelClass = config.model;
    } else if (typeof config.model === 'string') {// use lookup
      ModelClass = instance.constructor.$lookupModel(config.model);
    } else if (typeof config.model === 'function') {// check if is a callable (function)
      ModelClass = config.model();
    } else {
      ModelClass = config.model; // default: assign it as a model class
    }

    set = function set(values) {
      if (values == null) {// null or undefined
        return this.$relations[relationName] = [];
      }

      if (!_.isArray(values)) throw new Error("can't assign a non-array value to a hasMany relation");

      // TODO: should we assign values to fks? `${relation}_id`

      var modelInstances = _.map(values, function (value) {
        return value instanceof ModelClass ? value : new ModelClass(value);
      });

      return this.$relations[relationName] = modelInstances;
    };
  }

  Object.defineProperty(instance, relationName, {
    get: get,
    set: set,
    configurable: true,
    enumerable: true });

}


function defineRelation(instance, relationName, config) {var _ref4 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};_ref4.get;_ref4.set;
  switch (config.type) {
    case 'belongsTo':return belongsTo.apply(void 0, arguments);
    case 'hasMany':return hasMany.apply(void 0, arguments);
    case 'hasOne':return hasOne.apply(void 0, arguments);
    default:{
        throw new Error("Unknown relation type \"".concat(type, "\""));
      }}

}



function Relatable(Class) {var

  RelatableClass = /*#__PURE__*/function (_Class) {_inherits(RelatableClass, _Class);var _super = _createSuper(RelatableClass);
















    function RelatableClass() {var _this;_classCallCheck(this, RelatableClass);for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      _this = _super.call.apply(_super, [this].concat(args));

      var klass = _this.constructor;

      defineInternalProp(_assertThisInitialized(_this), '$$relations', {});

      // defining relations get/set properties
      _.each(klass.relations, function (config, relationName) {
        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!_this.hasOwnProperty(relationName)) {
          // first, check if it is defined in prototype
          if (_this.constructor.prototype.hasOwnProperty(relationName)) {
            var _proto = Object.getPrototypeOf(_assertThisInitialized(_this));
            var _descr = Object.getOwnPropertyDescriptor(_proto, relationName);
            defineRelation(_assertThisInitialized(_this), relationName, config, { get: _descr.get, set: _descr.set });
          } else {
            defineRelation(_assertThisInitialized(_this), relationName, config);
          }
        }
      });return _this;
    }_createClass(RelatableClass, [{ key: "$relations", get:

      function get() {
        // XXX: $relations and $$relations will be confusing...
        return this.$$relations;
      } }], [{ key: "$relations", get: // lazy evaluated $relations
      function get() {// avoiding static property inheritance
        // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
        if (!this.hasOwnProperty('$$relations')) {this.$$relations = this.$$relations || _.reduce(this.relations, function (result, config, name) {result[name] = config;return result;}, {});}return this.$$relations;} }]);return RelatableClass;}(Class);return RelatableClass;
}

function Translatable(Class) {var
  TranslatableClass = /*#__PURE__*/function (_Class) {_inherits(TranslatableClass, _Class);var _super = _createSuper(TranslatableClass);function TranslatableClass() {_classCallCheck(this, TranslatableClass);return _super.apply(this, arguments);}_createClass(TranslatableClass, null, [{ key: "i18nScope", get:
      function get() {
        return "models.".concat(this.$modelName);
      } }, { key: "$tModelName", value:

      function $tModelName() {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$count = _ref.count,count = _ref$count === void 0 ? 1 : _ref$count;
        return i18n.t(this.i18nScope, { count: count });
      } }, { key: "$tAttr", value:

      function $tAttr(attrName) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var scope = "".concat(this.i18nScope, ".attributes");
        return i18n.t(attrName, _.defaults({}, options, { scope: scope }));
      } }, { key: "$tEnum", value:

      function $tEnum(enumName) {var enumValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var scope = this.i18nScope;
        var key = null;

        if (enumValue === undefined) {
          // .attributes.${enumName}
          scope += '.attributes';
          key = enumName;
        } else {
          // .enums.${enumName}.${enumValue}
          scope += ".enums.".concat(enumName);
          key = enumValue;
        }

        return i18n.t(key, _.defaults({}, options, { scope: scope }));
      }

      // TODO: localize attribute
      // $l(attrName) {
      //  // checkout type definition for date or datetime
      //  // use $l('date', attrName)
      //  // or  $l('time', attrName)
      // }
    }]);return TranslatableClass;}(Class);

  return TranslatableClass;
}

// @see https://validatejs.org/#validators-datetime


// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function parse(value, options) {
    // return +moment.utc(value)
    return moment.utc(value);
  },
  // Input is a unix timestamp
  format: function format(value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  } });



validate.validators.datetime;

// XXX overwriting presence validator.
//
function presence(value, options, key, attrs) {
  var opts = _.merge({}, this.options, options);

  if (_.blank(value)) {
    return opts.message || this.message || "can't be blank";
  }

  // returning nothing means "is valid"
}

validate.validators.presence = presence;

// custom error formatter, creating a code/values interpolation scheme with i18n
// @see http://validatejs.org/#validate-error-formatting
function transformErrors(i18nScope, errors) {
  // errors sample:
  // [
  //   {
  //     "attribute": "username",
  //     "value": "nicklas",
  //     "validator": "exclusion",
  //     "globalOptions": {
  //       "format": "detailed"
  //     },
  //     "attributes": {
  //       "username": "nicklas",
  //       "password": "bad"
  //     },
  //     "options": {
  //       "within": [
  //         "nicklas"
  //       ],
  //       "message": "'%{value}' is not allowed"
  //     },
  //     "error": "Username 'nicklas' is not allowed"
  //   },
  //   {
  //     "attribute": "password",
  //     "value": "bad",
  //     "validator": "length",
  //     "globalOptions": {
  //       "format": "detailed"
  //     },
  //     "attributes": {
  //       "username": "nicklas",
  //       "password": "bad"
  //     },
  //     "options": {
  //       "minimum": 6,
  //       "message": "must be at least 6 characters"
  //     },
  //     "error": "Password must be at least 6 characters"
  //   }
  // ]
  errors = validate.groupErrorsByAttribute(errors);
  var transformedErrors = {};

  for (var attr in errors) {
    transformedErrors[attr] = [];var _iterator = _createForOfIteratorHelper(

    errors[attr]),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var error = _step.value;
        var code = error.validator;
        var message = _.get(error, 'options.message') ||
        i18n.t("errors.".concat(code), {
          scope: i18nScope,
          defaultValue: i18n.t("errors.".concat(code)),
          value: error.value });


        transformedErrors[attr].push({
          attribute: error.attribute,
          value: error.value,
          code: code,
          message: message });

      }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
  }

  return transformedErrors;
}


// validates a Model instance
// extracted to this private function because we can use it recursively on any related model
// if options and configurations demands it. (like `instance.$validate({ relations: true })`)
function _validate(instance) {
  var constraints = instance.constructor.constraints;
  // let instance = instance

  // adapting api to .then(success, error) to .then(success).catch(error)
  return new Promise(function (resolve, reject) {
    // - cleanAttributes: false - to tell validatejs not to delete empty or without constraint attributes
    // @see https://validatejs.org/#validate-async
    //   > Besides accepting all options as the non async validation function it also accepts
    //   > two additional options; cleanAttributes which, unless false, makes validate.async
    //   > call validate.cleanAttributes before resolving the promise (...)
    // @see https://validatejs.org/#utilities-clean-attributes
    validate.async(instance, constraints, { format: 'detailed', cleanAttributes: false }).
    then(
    function success(attributes) {
      // reset errors
      instance.$$errors = {};
      resolve(true);
    },

    function error(errors) {
      if (errors instanceof Error) {
        // runtime Error. Just throw it
        // reset errors
        instance.$$errors = {};
        reject(errors);
      } else {
        // validation error.
        // assign to $errors
        instance.$$errors = transformErrors(instance.constructor.i18nScope, errors);
        resolve(false);
      }
    });
  });
}


function Validatable(Class) {var

  ValidatableClass = /*#__PURE__*/function (_Class) {_inherits(ValidatableClass, _Class);var _super = _createSuper(ValidatableClass);

    function ValidatableClass() {var _this;_classCallCheck(this, ValidatableClass);for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      _this = _super.call.apply(_super, [this].concat(args));
      defineInternalProp(_assertThisInitialized(_this), '$$errors', {});return _this;
    }_createClass(ValidatableClass, [{ key: "$errors", get:

      function get() {
        return this.$$errors;
      } }, { key: "$validate", value: function () {var _$validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(











        function _callee() {var _ref,_ref$relations,relations,instance,promises,relationNames,_relations,responses,hasError,_args = arguments;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref$relations = _ref.relations, relations = _ref$relations === void 0 ? false : _ref$relations;
                  instance = this;
                  promises = [];

                  promises.push(_validate(instance));

                  if (relations) {
                    relationNames = Object.keys(instance.$relations);
                    _relations = _.pickBy(instance, function (relationData, relationName) {
                      return relationNames.includes(relationName) && _.present(relationData);
                    });

                    _.each(_relations, function (relationData, _relationName) {

                      if (Array.isArray(relationData)) {
                        relationData.forEach(function (relatedInstance) {return promises.push(_validate(relatedInstance));});

                      } else {
                        promises.push(_validate(relationData));
                      }
                    });
                  }_context.prev = 5;_context.next = 8;return (


                    Promise.all(promises));case 8:responses = _context.sent;
                  hasError = responses.includes(false);return _context.abrupt("return",

                  hasError ? Promise.resolve(false) : Promise.resolve(true));case 13:_context.prev = 13;_context.t0 = _context["catch"](5);return _context.abrupt("return",


                  Promise.reject(_context.t0));case 16:case "end":return _context.stop();}}}, _callee, this, [[5, 13]]);}));function $validate() {return _$validate.apply(this, arguments);}return $validate;}() }], [{ key: "$constraints", get: function get() {// avoiding static property inheritance
        // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
        if (!this.hasOwnProperty('$$constraints')) {this.$$constraints = _.clone(this.constraints);}return this.$$constraints;} }]);return ValidatableClass;}(Class);


  return ValidatableClass;
}

function _serializeObject(obj) {
  return _.reduce(obj, function (serialized, value, key) {
    serialized[key] = _serialize(value);
    return serialized;
  }, {});
}

function _serialize(value) {
  if (Array.isArray(value)) return value.map(_serialize);

  if (_.isObjectLike(value)) {
    return typeof value.toJSON === 'function' ? value.toJSON() : _serializeObject(value);
  }

  return value;
}var

Base = /*#__PURE__*/function () {function Base() {_classCallCheck(this, Base);}_createClass(Base, null, [{ key: "$modelNameAdapter", get:
    function get() {return _.camelize;} }, { key: "$modelName", get:
    function get() {return this.$modelNameAdapter(this.name);} }, { key: "attrs", get:

    function get() {return [];} }, { key: "enums", get:
    function get() {return {};} }, { key: "virtuals", get:
    function get() {return [];} }, { key: "$lookupModel", value:

    function $lookupModel(name) {
      throw new Error('Model.$lookupModel(name) is not implemented.');
    } }]);return Base;}();var Model = /*#__PURE__*/function (_mixin) {_inherits(Model, _mixin);var _super = _createSuper(Model);
  // allow programmatically checking if it's a model class

  // using "props" as name to make it explicit that we'll set any enumerable "property" in the instance
  // (JavaScript land - getOwnPropertyDescriptor() and prototype)
  function Model() {var _this2, _this3;var _this;var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},_ref$undefs = _ref.undefs,undefs = _ref$undefs === void 0 ? true : _ref$undefs;_classCallCheck(this, Model);
    _this = _super.call(this);

    (_this2 = _this).$beforeInit.apply(_this2, arguments); // hook for user land

    var propNames = writablePropNames(_assertThisInitialized(_this));
    var sanitizedProps = _.pick(props, propNames);

    if (undefs) {
      // start all props with undefined, allowing them to be observed (rxjs, Vue, ...)
      var undefProps = _.reduce(propNames, function (undefProps, name) {
        undefProps[name] = undefined;
        return undefProps;
      }, {});

      // adding undefs if not defined yet
      // _.defaults(sanitizedProps, undefProps)
      // XXX: using _.merge() here to keep properties names sorted
      sanitizedProps = _.merge(undefProps, sanitizedProps);
    }

    // set props, one-by-one, using setter method
    _.each(sanitizedProps, function (value, name) {
      _this[name] = value;
    });

    (_this3 = _this).$afterInit.apply(_this3, arguments); // hook for user land
    return _this;}_createClass(Model, [{ key: "$beforeInit", value:

    function $beforeInit() {
      // override it in subclasses
    } }, { key: "$afterInit", value:

    function $afterInit() {
      // override it in subclasses
    } }, { key: "toJSON", value:

    function toJSON() {var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref2$pick = _ref2.pick,pick = _ref2$pick === void 0 ? [] : _ref2$pick,_ref2$include = _ref2.include,include = _ref2$include === void 0 ? [] : _ref2$include,_ref2$omit = _ref2.omit,omit = _ref2$omit === void 0 ? [] : _ref2$omit,_ref2$virtuals = _ref2.virtuals,virtuals = _ref2$virtuals === void 0 ? false : _ref2$virtuals,_ref2$relations = _ref2.relations,relations = _ref2$relations === void 0 ? false : _ref2$relations,_ref2$undefs = _ref2.undefs,undefs = _ref2$undefs === void 0 ? false : _ref2$undefs;
      var json = _.clone(this.$attrs);


      if (virtuals) {
        _.merge(json, _.pick(this, this.constructor.virtuals));
      }

      if (relations) {
        var modelRelations = Object.keys(this.$relations);
        _.merge(json, _.pick(this, modelRelations));
      }

      if (_.present(pick)) {
        json = _.pick(json, pick);
      }

      if (_.present(include)) {
        json = _.merge(json, _.pick(this, include));
      }

      if (_.present(omit)) {
        json = _.omit(json, omit);
      }

      if (!undefs) {
        json = _.pickBy(json, function (val, key) {return !_.isUndefined(val);});
      }

      json = _.reduce(json, function (serialized, value, propName) {
        serialized[propName] = _serialize(value);

        return serialized;
      }, {});


      return json;
    } }, { key: "$serialize", value:

    function $serialize() {
      return this.toJSON.apply(this, arguments);
    } }], [{ key: "$$model", get: function get() {return true;} }]);return Model;}(mixin(Base, [Attributable, Relatable, Translatable, Validatable]));

function Decorator(ModelClass) {var

  DecoratedClass = /*#__PURE__*/function (_ModelClass) {_inherits(DecoratedClass, _ModelClass);var _super = _createSuper(DecoratedClass);


    function DecoratedClass(object) {_classCallCheck(this, DecoratedClass);
      var _object = object instanceof Model ? object : new ModelClass(object);

      // sanity check
      if (_object.hasOwnProperty('$object')) {
        throw new Error('Decorated object cannot have a property named "$object"');
      }return _super.call(this, _objectSpread2({

        $object: _object }, _object.$props));
    }

    // hook to define $object before constructing the model instance
    _createClass(DecoratedClass, [{ key: "$beforeInit", value: function $beforeInit(props, opts) {
        this.$object = props.$object;

        _get(_getPrototypeOf(DecoratedClass.prototype), "$beforeInit", this).call(this, props, opts);
      } }], [{ key: "$modelClass", get: function get() {return ModelClass;} }]);return DecoratedClass;}(ModelClass);


  return DecoratedClass;
}

var _contents_errorsEnUS = { "en-US": { errors: { date: "must be a valid date", datetime: "must be a valid date", email: "is not a valid e-mail", equality: "is not equal to %{attribute}", exclusion: "%{value} is restricted", format: "is invalid", inclusion: "%{value} is not included in the list", length: "has incorrect length", numericality: "must be a valid number", presence: "can't be blank", url: "is not a valid URL", type: "has incorrect type" } } };var _contents_errorsPtBR = { "pt-BR": { errors: { date: "n\xE3o \xE9 uma data v\xE1lida", datetime: "n\xE3o \xE9 uma data v\xE1lida", email: "n\xE3o \xE9 um e-mail v\xE1lido", equality: "n\xE3o \xE9 igual a %{attribute}", exclusion: "%{value} n\xE3o \xE9 permitido", format: "n\xE3o \xE9 v\xE1lido", inclusion: "%{value} n\xE3o est\xE1 inclu\xEDdo na lista", length: "tem tamanho incorreto", numericality: "n\xE3o \xE9 um n\xFAmero v\xE1lido", presence: "n\xE3o pode ficar em branco", url: "n\xE3o \xE9 uma URL v\xE1lida", type: "n\xE3o \xE9 do tipo correto" } } };var contents = { errorsEnUS: _contents_errorsEnUS, errorsPtBR: _contents_errorsPtBR };Object.freeze(contents);


var translations = {};

_.each(contents, function (content, _id) {
  _.merge(translations, content);
});

export { Decorator, Model, mixin, translations };
//# sourceMappingURL=model.esm.js.map
