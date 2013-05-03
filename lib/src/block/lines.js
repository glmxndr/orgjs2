var _  = require('lodash');
var _U = require('../utils');

/**
 * Lines constructor
 * @param {String|Array} text either a string which will be split into lines,
 *                            or an array of lines in reverse order.
 */
var Lines = function (text) {
  if (_.isArray(text)) {
    this.arr = text;
  } else if (_.isString(text)) {
    this.arr = text.split(/\r?\n/g).reverse();
  } else {
    this.arr = [];
  }
};

Lines.prototype = {
  length: function () {return this.arr.length;},

  rest: function () { return this.arr.slice().reverse(); },

  peak: function () {
    return this.arr[this.arr.length - 1];
  },

  pop: function () { return this.arr.pop(); },

  popWhile: function (matcher) {
    var matcherFn = matcher;
    if (_.isRegExp(matcher)) {
      matcherFn = function (str) {
        return str.match(matcher);
      };
    }

    var result = [];
    var line = this.pop();
    while (_.isString(line) && matcherFn(line)) {
      result.push(line);
      line = this.pop();
    }
    if (_.isString(line)) { this.push(line); }
    return result.reverse();
  },

  popUntil: function (matcher) {
    var matcherFn = function () {return true;};
    if (_.isRegExp(matcher)) {
      matcherFn = function (str) {
        return !str.match(matcher);
      };
    } else if (_.isFunction(matcher)) {
      matcherFn = function (str) {return !matcher(str);};
    }
    return this.popWhile(matcherFn);
  },

  trimBlank: function () {
    return this.popWhile(/^\s*$/);
  },

  push: function (arg) {
    if (_.isString(arg)) {
      this.arr.push(arg);
    } else if (_.isArray(arg)) {
      this.arr = this.arr.concat(arg);
    } else {
      this.arr.push('');
    }
  }
};

module.exports = exports = Lines;