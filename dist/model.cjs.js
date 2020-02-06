'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('@caiena/lodash-ext'));
var Enum = _interopDefault(require('@caiena/enum'));
var i18n = require('@caiena/i18n');
var validate = _interopDefault(require('validate.js'));
var moment = _interopDefault(require('moment'));

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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

// utility function for metaprogramming


function defineInternalProp(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    writable: true,
    configurable: true,
    value });

}


// checks for property in instance or its prototype
function writableProp(instance, name) {
  // avoiding reserved props (e.g. constructor) or names starting with $ - model.js "meta" props
  if (_.includes(['constructor'], name) || _.startsWith(name, '$')) return false;

  let descriptor = null;

  if (instance.hasOwnProperty(name)) {
    descriptor = Object.getOwnPropertyDescriptor(instance, name);
  } else {
    // falling back to prototype
    let prototype = Object.getPrototypeOf(instance);
    descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  }

  return !!descriptor.set || descriptor.writable === true;
}


// checks for property in instance or its prototype
function writablePropNames(instance) {
  let prototype = Object.getPrototypeOf(instance);
  let propNames = _.chain(Object.getOwnPropertyNames(instance)).
  concat(Object.getOwnPropertyNames(prototype)).
  uniq().
  value().
  sort();

  return _.filter(propNames, name => writableProp(instance, name));
}

// @see https://github.com/Vincit/objection.js/blob/2f7dd232aec1b1b3d880d10e75b169af2554ea91/lib/utils/mixin.js


function mixin(Class, mixins) {
  return mixins.reduce((MixedClass, Mixin) => Mixin(MixedClass), Class);
}

function defineAttr(obj, attrName, { get = null, set = null } = {}) {
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
    get,
    set,
    configurable: true,
    enumerable: true });

}

function defineEnum(obj, enumName, { get = null, set = null } = {}) {
  // custom setter for enums
  if (!set) {
    set = function set(value) {
      // ensures setting the key as attr value
      let key = this.constructor.$enums[enumName].key(value);
      return this.$attrs[enumName] = key;
    };
  }

  defineAttr(obj, enumName, { get, set });
}



function Attributable(Class) {

  class AttributableClass extends Class {

    // lazy evaluated $enums, using @caiena/enum
    static get $enums() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$enums')) {
        this.$$enums = _.reduce(this.enums, (result, enumeration, enumName) => {
          // transform to Enum instance, if needed
          result[enumName] = enumeration instanceof Enum ? enumeration : new Enum(enumeration);

          return result;
        }, {});
      }

      return this.$$enums;
    }

    // lazy evaluated $attrs
    // for now we're only keeping the API consistent, adding a '$methodName' getter
    // TODO: define types and create "intelligent" setters? (with constraints)
    static get $attrs() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$attrs')) {
        this.$$attrs = _.clone(this.attrs);
      }

      return this.$$attrs;
    }


    // lazy evaluated $virtuals
    // for now we're only keeping the API consistent, adding a '$methodName' getter
    // TODO: define types and create "intelligent" setters? (with constraints)
    static get $virtuals() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$virtuals')) {
        this.$$virtuals = _.clone(this.virtuals);
      }

      return this.$$virtuals;
    }


    constructor(...args) {
      super(...args);

      let klass = this.constructor;

      defineInternalProp(this, '$$attrs', {});

      // handling enums first then attrs, avoiding overrides
      // defining enums get/set properties
      _.each(klass.$enums, (enumeration, enumName) => {
        // sanity check!
        // enum must be defined in attrs list as well
        if (!_.includes(klass.$attrs, enumName)) {
          throw new Error(`enum "${enumName}" is not listed as an attribute in model ${klass.name}`);
        }

        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!this.hasOwnProperty(enumName)) {
          // first, check if it is defined in prototype
          if (this.constructor.prototype.hasOwnProperty(enumName)) {
            let _proto = Object.getPrototypeOf(this);
            let _descr = Object.getOwnPropertyDescriptor(_proto, enumName);
            defineEnum(this, enumName, { get: _descr.get, set: _descr.set });
          } else {
            defineEnum(this, enumName);
          }
        }
      });

      // defining attrs get/set properties
      _.each(klass.$attrs, attrName => {
        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!this.hasOwnProperty(attrName)) {
          // first, check if it is defined in prototype
          if (this.constructor.prototype.hasOwnProperty(attrName)) {
            let _proto = Object.getPrototypeOf(this);
            let _descr = Object.getOwnPropertyDescriptor(_proto, attrName);
            defineAttr(this, attrName, { get: _descr.get, set: _descr.set });
          } else {
            defineAttr(this, attrName);
          }
        }
      });
    }

    get $attrs() {
      // XXX: $attrs and $$attrs will be confusing...
      return this.$$attrs;
    }

    set $attrs(attrs) {
      // TODO: remove old code
      // return _.merge(this.$$attrs, attrs)

      // set props, one-by-one, using setter method
      let sanitizedAttrs = _.pick(attrs, this.constructor.$attrs);
      _.each(sanitizedAttrs, (value, name) => {
        this[name] = value;
      });
    }

    // TODO: remove it?
    get $props() {
      let instance = this;
      let proto = Object.getPrototypeOf(this);
      let propNames = _.chain(Object.getOwnPropertyNames(proto)).
      concat(Object.getOwnPropertyNames(instance)).
      filter(name => !(_.includes(['constructor'], name) || _.startsWith(name, '$'))).
      uniq().
      value().
      sort();

      return _.reduce(propNames, (props, propName) => {
        props[propName] = this[propName];
        return props;
      }, {});
    }

    $blank(attrNameOrPath) {
      return _.blank(this.$get(attrNameOrPath));
    }

    $enumValue(enumName) {
      return this.constructor.$enums[enumName].value(this[enumName]);
    }

    $get(attrNameOrPath) {
      return _.get(this, attrNameOrPath);
    }

    $has(attrNameOrPath) {
      // TODO: should it be _.hasIn(), to include inherited properties?
      // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for its exitence.
      // It can have side effects!
      return _.has(this, attrNameOrPath);
    }

    $pick(...attrNamesOrPathes) {
      return _.pick(this, ...attrNamesOrPathes);
    }

    $present(attrNameOrPath) {
      return _.present(this.$get(attrNameOrPath));
    }

    $set(attrNameOrPath, value) {
      return _.set(this, attrNameOrPath, value);
    }}


  return AttributableClass;
}

function belongsTo(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null;

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
    get,
    set,
    configurable: true,
    enumerable: true });

}


function hasOne(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null;

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
    get,
    set,
    configurable: true,
    enumerable: true });

}


function hasMany(instance, relationName, config, { get = null, set = null } = {}) {
  if (!get) {
    get = function get() {
      return this.$relations[relationName];
    };
  }

  if (!set) {
    // providing a way to lazily evaluate related model class
    let ModelClass = null;

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

      let modelInstances = _.map(values, value => {
        return value instanceof ModelClass ? value : new ModelClass(value);
      });

      return this.$relations[relationName] = modelInstances;
    };
  }

  Object.defineProperty(instance, relationName, {
    get,
    set,
    configurable: true,
    enumerable: true });

}


function defineRelation(instance, relationName, config, { get, set } = {}) {
  switch (config.type) {
    case 'belongsTo':return belongsTo(...arguments);
    case 'hasMany':return hasMany(...arguments);
    case 'hasOne':return hasOne(...arguments);
    default:{
        throw new Error(`Unknown relation type "${type}"`);
      }}

}



function Relatable(Class) {

  class RelatableClass extends Class {

    // lazy evaluated $relations
    static get $relations() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$relations')) {
        this.$$relations = this.$$relations || _.reduce(this.relations, (result, config, name) => {
          result[name] = config;
          return result;
        }, {});
      }

      return this.$$relations;
    }


    constructor(...args) {
      super(...args);

      let klass = this.constructor;

      defineInternalProp(this, '$$relations', {});

      // defining relations get/set properties
      _.each(klass.relations, (config, relationName) => {
        // XXX: lodash _.has and _.hasIn actually _execute_ the method/property to check for
        // existence. We don't want that!
        if (!this.hasOwnProperty(relationName)) {
          // first, check if it is defined in prototype
          if (this.constructor.prototype.hasOwnProperty(relationName)) {
            let _proto = Object.getPrototypeOf(this);
            let _descr = Object.getOwnPropertyDescriptor(_proto, relationName);
            defineRelation(this, relationName, config, { get: _descr.get, set: _descr.set });
          } else {
            defineRelation(this, relationName, config);
          }
        }
      });
    }

    get $relations() {
      // XXX: $relations and $$relations will be confusing...
      return this.$$relations;
    }}


  return RelatableClass;
}

function Translatable(Class) {
  class TranslatableClass extends Class {
    static get i18nScope() {
      return `models.${this.$modelName}`;
    }

    static $tModelName({ count = 1 } = {}) {
      return i18n.i18n.t(this.i18nScope, { count });
    }

    static $tAttr(attrName, options = {}) {
      let scope = `${this.i18nScope}.attributes`;
      return i18n.i18n.t(attrName, _.defaults({}, options, { scope }));
    }

    static $tEnum(enumName, enumValue = undefined, options = {}) {
      let scope = this.i18nScope;
      let key = null;

      if (enumValue === undefined) {
        // .attributes.${enumName}
        scope += '.attributes';
        key = enumName;
      } else {
        // .enums.${enumName}.${enumValue}
        scope += `.enums.${enumName}`;
        key = enumValue;
      }

      return i18n.i18n.t(key, _.defaults({}, options, { scope }));
    }

    // TODO: localize attribute
    // $l(attrName) {
    //  // checkout type definition for date or datetime
    //  // use $l('date', attrName)
    //  // or  $l('time', attrName)
    // }
  }

  return TranslatableClass;
}

// @see https://validatejs.org/#validators-datetime


// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse(value, options) {
    // return +moment.utc(value)
    return moment.utc(value);
  },
  // Input is a unix timestamp
  format(value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  } });



validate.validators.datetime;

// XXX overwriting presence validator.
//
function presence(value, options, key, attrs) {
  let opts = _.merge({}, this.options, options);

  if (_.blank(value)) {
    return opts.message || this.message || "can't be blank";
  }

  // returning nothing means "is valid"
}

validate.validators.presence = presence;

// import { isValid } from '@fnando/cpf'
const { isValid } = require("@fnando/cpf/dist/node");

function cpf(value, options, key, attrs) {
  let opts = _.merge({}, this.options, options);

  if (_.present(value) && !isValid(value)) {
    return opts.message || this.message || "is not a valid CPF";
  }

  // returning nothing means "is valid"
}

validate.validators.cpf = cpf;

// custom error formatter, creating a code/values interpolation scheme with i18n
// @see http://validatejs.org/#validate-error-formatting
function transformErrors(i18nScope, errors) {
  // errors sample:
  // // => [
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
  let transformedErrors = {};

  for (let attr in errors) {
    transformedErrors[attr] = [];

    for (let error of errors[attr]) {
      let code = error.validator;
      let message = _.get(error, 'options.message') ||
      i18n.i18n.t(`errors.${code}`, {
        scope: i18nScope,
        defaultValue: i18n.i18n.t(`errors.${code}`),
        value: error.value });


      transformedErrors[attr].push({
        attribute: error.attribute,
        value: error.value,
        code,
        message });

    }
  }

  return transformedErrors;
}


function Validatable(Class) {

  class ValidatableClass extends Class {

    constructor(...args) {
      super(...args);
      defineInternalProp(this, '$$errors', {});
    }

    get $errors() {
      return this.$$errors;
    }

    static get $constraints() {
      // avoiding static property inheritance
      // @see http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
      if (!this.hasOwnProperty('$$constraints')) {
        this.$$constraints = _.clone(this.constraints);
      }

      return this.$$constraints;
    }

    async $validate() {
      let constraints = this.constructor.constraints;
      let instance = this;

      // adapting api to .then(success, error) to .then(success).catch(error)
      return new Promise((resolve, reject) => {
        // - cleanAttributes: false - to tell validatejs not to delete empty or without constraint attributes
        // @see https://validatejs.org/#validate-async
        //   > Besides accepting all options as the non async validation function it also accepts
        //   > two additional options; cleanAttributes which, unless false, makes validate.async
        //   > call validate.cleanAttributes before resolving the promise (...)
        // @see https://validatejs.org/#utilities-clean-attributes
        validate.async(this, constraints, { format: 'detailed', cleanAttributes: false }).
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
    }}


  return ValidatableClass;
}

class Base {
  static get $modelNameAdapter() {return _.camelize;}
  static get $modelName() {return this.$modelNameAdapter(this.name);}

  static get attrs() {return [];}
  static get enums() {return {};}
  static get virtuals() {return [];}

  static $lookupModel(name) {
    throw new Error('Model.$lookupModel(name) is not implemented.');
  }}


class Model extends mixin(Base, [Attributable, Relatable, Translatable, Validatable]) {
  static get $$model() {return true;} // allow programmatically checking if it's a model class

  // using "props" as name to make it explicit that we'll set any enumerable "property" in the instance
  // (JavaScript land - getOwnPropertyDescriptor() and prototype)
  constructor(props = {}, { undefs = true } = {}) {
    super();

    this.$beforeInit(...arguments); // hook for user land

    let propNames = writablePropNames(this);
    let sanitizedProps = _.pick(props, propNames);

    if (undefs) {
      // start all props with undefined, allowing them to be observed (rxjs, Vue, ...)
      let undefProps = _.reduce(propNames, (undefProps, name) => {
        undefProps[name] = undefined;
        return undefProps;
      }, {});

      // adding undefs if not defined yet
      // _.defaults(sanitizedProps, undefProps)
      // XXX: using _.merge() here to keep properties names sorted
      sanitizedProps = _.merge(undefProps, sanitizedProps);
    }

    // set props, one-by-one, using setter method
    _.each(sanitizedProps, (value, name) => {
      this[name] = value;
    });

    this.$afterInit(...arguments); // hook for user land
  }

  $beforeInit(...args) {
    // override it in subclasses
  }

  $afterInit(...args) {
    // override it in subclasses
  }

  toJSON({ pick = [], include = [], omit = [], virtuals = false, relations = false, undefs = false } = {}) {
    let json = _.clone(this.$attrs);

    if (!undefs) {
      json = _.pickBy(json, (val, key) => !_.isUndefined(val));
    }

    if (virtuals) {
      _.merge(json, _.pick(this, this.constructor.virtuals));
    }

    if (relations) {// TODO: test it
      _.merge(json, _.pick(this, this.constructor.$relations));
    }

    if (_.present(pick)) {
      json = _.pick(json, pick);
    }

    if (_.present(include)) {// TODO: test it
      json = _.merge(json, _.pick(this, include));
    }

    if (_.present(omit)) {
      json = _.omit(json, omit);
    }

    return json;
  }

  $serialize(...args) {
    return this.toJSON(...args);
  }}

function Decorator(ModelClass) {

  class DecoratedClass extends ModelClass {
    static get $modelClass() {return ModelClass;}

    constructor(object) {
      let _object = object instanceof Model ? object : new ModelClass(object);

      // sanity check
      if (_object.hasOwnProperty('$object')) {
        throw new Error('Decorated object cannot have a property named "$object"');
      }

      super(_objectSpread({ $object: _object }, _object.$props));
    }

    // hook to define $object before constructing the model instance
    $beforeInit(props, opts) {
      this.$object = props.$object;

      super.$beforeInit(props, opts);
    }}


  return DecoratedClass;
}

const _contents_errorsEnUS = { "en-US": { errors: { date: "must be a valid date", datetime: "must be a valid date", email: "is not a valid e-mail", equality: "is not equal to %{attribute}", exclusion: "%{value} is restricted", format: "is invalid", inclusion: "%{value} is not included in the list", length: "has incorrect length", numericality: "must be a valid number", presence: "can't be blank", url: "is not a valid URL", type: "has incorrect type", cpf: "is not a valid CPF" } } };const _contents_errorsPtBR = { "pt-BR": { errors: { date: "n\xE3o \xE9 uma data v\xE1lida", datetime: "n\xE3o \xE9 uma data v\xE1lida", email: "n\xE3o \xE9 um e-mail v\xE1lido", equality: "n\xE3o \xE9 igual a %{attribute}", exclusion: "%{value} n\xE3o \xE9 permitido", format: "n\xE3o \xE9 v\xE1lido", inclusion: "%{value} n\xE3o est\xE1 inclu\xEDdo na lista", length: "tem tamanho incorreto", numericality: "n\xE3o \xE9 um n\xFAmero v\xE1lido", presence: "n\xE3o pode ficar em branco", url: "n\xE3o \xE9 uma URL v\xE1lida", type: "n\xE3o \xE9 do tipo correto", cpf: "n\xE3o \xE9 um CPF v\xE1lido" } } };const contents = { errorsEnUS: _contents_errorsEnUS, errorsPtBR: _contents_errorsPtBR };Object.freeze(contents);


const translations = {};

_.each(contents, (content, _id) => {
  _.merge(translations, content);
});

exports.Decorator = Decorator;
exports.Model = Model;
exports.mixin = mixin;
exports.translations = translations;
//# sourceMappingURL=model.cjs.js.map
