var async = require('async');
var actions = {};

var createFromArray = function (arr) {
  return function (input, next) {
    var current = 0;
    var input = input;
    var transition = function () {
      if (current >= arr.length) return next(null, input);
      if (!arr[current]) return next({ message: "undefined_action_in_definition" });
      exports.run(arr[current], input, function (err, output) {
        if (err) return next(err);
        current++;
        input = output;
        setImmediate(function () {
          transition();
        });
      })
    }
    transition();
  }
}

var createFromObject = function (opts) {
  if ([
    'filter',
    'filterSeries',
    'reject',
    'rejectFilter',
    'detect',
    'detectSeries',
    'sortBy',
    'some',
    'every',
    'concat',
    'map',
    'mapSeries'
  ].indexOf(opts.type) >= 0) {
    return function (input, next) {
      async[opts.type](input, function (obj, cb) {
        exports.run(opts.fn, obj, cb);
      }, next);
    }
  }
}

var createFn = function (opts) {
  if (opts.constructor === Array) {
    return createFromArray(opts);
  }
  return createFromObject(opts);
}

var getFn = function (opts) {
  if (typeof opts === 'function') return opts;
  if (typeof opts === 'string')   return actions[opts] || null;
  if (typeof opts === 'object')   return createFn(opts);
  return null;
}

exports.define = function (name, defn) {
  if (!name) throw new Error("missing_name");
  if (!defn) throw new Error("missing_definition");
  if (typeof defn === 'string') throw new Error("definition_is_a_string");
  actions[name] = getFn(defn);
}

exports.run = function (start, input, next) {
  var fn = getFn(start);
  if (typeof fn !== 'function') return next({ message: "unknown_action", details: { action: start, fn: fn } });
  next = next || function(){};
  fn(input, next);
}
