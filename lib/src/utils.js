require('./shim');
var _ = require('lodash');

var _U = {

  load: function (location) {
    var result = "",
        req    = require,
        fs     = req('fs'),
        globl  = (function(){return this;}());
    if (XMLHttpRequest) {
      var request = new XMLHttpRequest();
      request.open('GET', location, false);
      request.send(null);
      if (request.status === 200) { result = request.responseText; }
      else {result = "Status " + request.status + " on " + location; }
    } else if (fs) {
      // Else pretend we're in node.js...
      result = fs.readFileSync(location);
    }
    return result;
  },

  randomStr: function(length, chars){
    var str = "";
    var available = chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        str += available.charAt(Math.floor(Math.random() * available.length));
    return str;
  },

  absentToken: function (txt, prefix) {
    prefix = prefix || "TKN";
    var token, start = prefix;
    if(txt.indexOf(start) === -1){return start;}
    token = start + this.randomStr(5);
    while(txt.indexOf(token) !== -1){
      token = start + this.randomStr(5);
    }
    return token;
  },

  newToken: function (prefix) {
    return [prefix, ':', _U.id(), ';'].join('');
  },

  repeat: function(str, times){
    var result = [];
    for(var i=0; i<times; i++){ result.push(str); }
    return result.join('');
  },

  array: function (o) { return Array.prototype.slice.call(o); },

  
  join: function () {
    return _U.array(arguments).join('');
  },

  exists: function (o) {
    return !_.isUndefined(o) && !_.isNull(o);
  },

  ensure: function (obj, def) {
    return _U.exists(obj) ? obj
         : _U.exists(def) ? def
         : {} ;
  },

  blank: function(str){
    // Valid only for strings and arrays
    return !str || (""+str).match(/^\s*$/);
  },

  notBlank: function(str){
    // Valid only for strings and arrays
    return !this.blank(str);
  },

  peak: function (lines) {
    return  lines.peak ? lines.peak() : "" + lines;
  },

  indentLevel: function (line){
    return (/^ */).exec(line || "")[0].length;
  },

  /**
   * Creates an array of lines to be parsed. The lines are in reverse order.
   * This means that in order to access the first line to parse, use lines.pop().
   * 
   * @param  {String} text the string to make lines out of
   * @return {Array} the lines in reverse order
   */
  lines: function (text) {
    return text.split(/\r?\n/g).reverse();
  },

  /**
   * Builds a parsing state object, with the last parsed object and the rest of
   * the lines to parse.
   * @param  {Object} node  the last object parsed
   * @param  {Array}  lines the rest of the lines to parse
   * @return {Object} 
   */
  state: function (node, lines) {
    return {
      "node" : node,
      "lines": lines
    };
  },

  /**
   * Build the prototype of the given Constructor with the functions of the
   * Parent prototype, and the given functions in the fns object.
   *
   * @param  {Function} Constr a constructor function
   * @param  {Function} Parent the parent constructor function
   * @param  {Object}   fns    the functions to add, specific to Constr
   * @return {Object} the new Constr prototype
   */
  extendProto: function (Constr, Parent, fns, args) {
    Constr.prototype = _.assign({}, Parent.prototype, Constr.prototype, fns);
    return Constr.prototype;
  },

  /**
   * Provides an incrementing function.
   * @return {Function} A function returning an integer incremented at each call.
   */
  incrementor: function () { var i = 0; return function(){ return ++i; }; },

  /**
   * Applies a function for each element of the given array or object
   */
  each: function(arr, fn){
    var name, length = arr.length, i = 0, isObj = length === undefined;
    if ( isObj ) {
      for ( name in arr ) {
        if ( fn.call( arr[ name ], arr[ name ], name ) === false ) {break;}
      }
    } else {
      if(!length){return;}
      for ( var value = arr[0];
        i < length && fn.call( value, value, i ) !== false;
        value = arr[++i] ) {}
    }
  },

  /**
   * Applies the given function for each element of the given array or
   * object, and returns the array of results
   */
  map: function(arr, fn){
    var result = [];
    this.each(arr, function(val, idx){
      var mapped = fn.call(val, val, idx);
      if (mapped !== null){result.push(mapped);}
    });
    return result;
  },

  /** 
   * Applies the given function for each element of the given array or
   * object, and returns the array of filtered results
   */
  filter: function(arr, fn){
    var result = [];
    this.each(arr, function(val, idx){
      var mapped = fn.call(val, val, idx);
      if (mapped){result.push(val);}
    });
    return result;
  }
};

/**
 * An easily callable incrementor.
 * @type {Function}
 */
_U.id = _U.incrementor();

module.exports = exports = _U;