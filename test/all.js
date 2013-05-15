;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
        return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}
},{}],3:[function(require,module,exports){
var _U       = require('./utils');
var _        = _U._;
var TreeNode = require('./tree');

var Block = function (parent) {
  TreeNode.call(this, parent);
};

_U.extendProto(Block, TreeNode, {
  init         : function () {},
  parentIndent : function () {
    return (this.parent && this.parent.indent) ? this.parent.indent : 0;
  }
});

var prec = Block.precedence = {};

/**
 * Allows to register a new Block constructor at a given precedence level.
 * @param  {Block} Constr the block constructor
 * @param  {String} level  the level name, must be present in Block.levels
 */
Block.register = function (level, Constr) {
  if (prec[level]) {Block.register(level + 1, Constr);}
  else { prec[level] = Constr; }
  return Constr;
};

/**
 * Get the Block constructor matching the given lines.
 * @param  {Array} lines the following lines
 * @return {Block}       the constructor
 */
Block.get = function (lines, parent) {
  var result;
  _.each(_U.ordered(prec), function(Constr){
    if (Constr.match && Constr.match(lines, parent)) { 
      result = Constr; 
      return false; 
    }
  });
  return result;
};

Block.define = function (obj) {
  var Parent = (obj.parent || Block);
  var Result = function () {
    Parent.apply(this, arguments);
    this.type = obj.type;
    if (this.init) { this.init.apply(this, arguments); }
  };
  Result.type = obj.type;
  Result.match = obj.match || Parent.match || function () { return false; };
  _U.extendProto(Result, Parent, obj.methods);
  return Result;
};

module.exports = exports = Block;
},{"./utils":4,"./tree":5}],6:[function(require,module,exports){
var _ = require('./utils')._;

var Config = {};

Config.defaults = {
  include: true,
  basePath: './',
  tabSize: 4,
  headlineTodos: ['TODO', 'DONE'],
  headlinePriorities: ['A', 'B', 'C'],
  get: function (p, def) { return this.hasOwnProperty(p) ? this[p] : def; }
};

/**
 * Prepare a given configuration object into a full-blown 
 * configuration, with all omitted defaults values in place.
 * 
 * @param  {Object} params the partial configuration object
 * @return {Object}        the complete configuration, with defaults
 */
Config.prepare = function (params) {
  return _.defaults({}, params, Config.defaults);
};

module.exports = exports = Config;
},{"./utils":4}],7:[function(require,module,exports){
(function(){var _U           = require('./utils');
var RenderEngine = require('./render/engine');
var HtmlMatchers = require('./render/default/html');
var Block        = require('./block');
var Inline       = require('./inline');

var Org = function (obj) {
  obj = obj || {};
  this.config = require('./config').prepare(obj);
  var that = this;
  this.parse = {
    headline: require('./block/headline').parser(that),
    document: require('./document').parser(that),
    inline: require('./inline').parser(that)
  };

  this.render = {
    defaults: {
      html: new RenderEngine({matchers: HtmlMatchers})
    }
  };
};

Org.prototype = {
  parseDocument: function (content) {
    return this.parse.document(content);
  },
  parseDocumentAt: function (location) {
    return this.parseDocument(_U.load(location));
  }
};

// Exposing components 
// (and forcing them to load, so that they can plug themselves).
Org.components = {
  Document : require('./document'),
  block: {
    Clockline  : Block.register(  50, require('./block/properties/clockline')),
    Deadline   : Block.register(  50, require('./block/properties/deadline')),
    Scheduled  : Block.register(  50, require('./block/properties/scheduled')),
    Illust     : Block.register(  60, require('./block/illust')),
    Hr         : Block.register( 100, require('./block/special/hr')),
    FnDef      : Block.register( 200, require('./block/special/fndef')),
    Example    : Block.register( 300, require('./block/beginend/example')),
    Quote      : Block.register( 300, require('./block/beginend/quote')),
    Center     : Block.register( 300, require('./block/beginend/center')),
    Comment    : Block.register( 300, require('./block/beginend/comment')),
    Verse      : Block.register( 300, require('./block/beginend/verse')),
    Src        : Block.register( 300, require('./block/beginend/src')),
    Dlist      : Block.register( 500, require('./block/lists/dlist')),
    DlItem     : Block.register( 510, require('./block/lists/dlitem')),
    Ulist      : Block.register( 520, require('./block/lists/ulist')),
    UlItem     : Block.register( 530, require('./block/lists/ulitem')),
    Olist      : Block.register( 540, require('./block/lists/olist')),
    OlItem     : Block.register( 550, require('./block/lists/olitem')),
    Drawer     : Block.register(1000, require('./block/special/drawer')),
    Section    : Block.register(8000, require('./block/section')),
    PropDef    : Block.register(8500, require('./block/properties/propdef')),
    CommentLine: Block.register(9000, require('./block/special/commentline')),
    Para       : Block.register(9999, require('./block/para'))
  },
  inline: {
    Link      : Inline.register( 100, require('./inline/link')),
    Latex     : Inline.register( 200, require('./inline/latex')),
    FnRef     : Inline.register( 300, require('./inline/fnref')),
    Entity    : Inline.register( 400, require('./inline/entity')),
    Verbatim  : Inline.register( 500, require('./inline/verbatim')),
    Sub       : Inline.register( 600, require('./inline/sub')),
    Sup       : Inline.register( 600, require('./inline/sup')),
    Emphasis  : Inline.register(1000, require('./inline/emphasis')),
    Linebreak : Inline.register(1100, require('./inline/linebreak')),
    Regular   : Inline.register(9999, require('./inline/regular'))
  }
};

var global = (function(){return this;}());
global.Org = Org;

module.exports = exports = Org;
})()
},{"./utils":4,"./render/engine":8,"./render/default/html":9,"./inline":10,"./config":6,"./block/headline":11,"./document":12,"./block/properties/clockline":13,"./block/properties/deadline":14,"./block/properties/scheduled":15,"./block/illust":16,"./block/special/hr":17,"./block/special/fndef":18,"./block/beginend/example":19,"./block/beginend/quote":20,"./block/beginend/center":21,"./block/beginend/verse":22,"./block/lists/dlitem":23,"./block/lists/dlist":24,"./block/lists/ulist":25,"./block/lists/ulitem":26,"./block/lists/olist":27,"./block/beginend/comment":28,"./block/special/drawer":29,"./block":3,"./block/section":30,"./block/beginend/src":31,"./block/lists/olitem":32,"./block/special/commentline":33,"./inline/link":34,"./inline/latex":35,"./block/para":36,"./block/properties/propdef":37,"./inline/verbatim":38,"./inline/entity":39,"./inline/fnref":40,"./inline/sub":41,"./inline/sup":42,"./inline/emphasis":43,"./inline/linebreak":44,"./inline/regular":45}],46:[function(require,module,exports){
var _U    = require('./utils');
var Lines = require('./block/lines');

var Include = function (doc) {
  this.doc = doc;
  this.org = doc.org;
  this.config = this.org.config;
  this.basePath = this.config.basePath;
};

Include.prototype = {
  rgxp: {
    includeLine: /^([^\S\n]*)#\+INCLUDE:\s*"([^"]+)"(?:\s+(example|quote|src)\b)?.*?$/mgi
  },
  replace: function (txt) {
    var include = this;
    return txt.replace(this.rgxp.includeLine, function (line, indent, url, beginend) {
      console.log(arguments);

      // Parsing the line and extracting the parameters
      var location = _U.path.join(include.basePath, url);
      var match, srcType,
          prefix = '', prefix1 = '',
          minlevel,
          limit,
          limitMin = 0, limitMax = Infinity,
          limitNum;

      if (beginend === 'src') {
        srcType = (/\ssrc\s+([^:\s]+)/.exec(line) || [])[1];
      }

      match = line.match(/:prefix\s+"([^"]+)"/);
      if (match) { prefix   = match[1]; }
      match = line.match(/:prefix1\s+"([^"]+)"/);
      if (match) { prefix1  = match[1]; }
      match = line.match(/:minlevel\s+("?)(\d+)\1/);
      if (match) { minlevel = match[2]; }
      match = line.match(/:lines\s+"(\d*-\d*)"/);
      if (match) {
         limit = match[1];
        if (limit.match(/^\d*-\d*$/)) {
          limitNum = limit.match(/^\d+/);
          if (limitNum) {
             limitMin = +(limitNum[0]) - 1;
          }
          limitNum =  limit.match(/\d+$/);
          if (limitNum) {
             limitMax = +(limitNum[0]);
          }
        }
      }

      // Loading the content
      var content = _U.load(location);

      // Modifying the headlines levels (if =:minlevel= has been set)
      if(minlevel && !beginend){
        var minfound = 1000;
        var headlineRgx = /^\*+(?=\s)/mg;
        var foundstars = content.match(headlineRgx);
        _U.each(foundstars, function (v) {
          minfound = Math.min(minfound, v.length);
        });
        if(minlevel > minfound){
          var starsToAppend = _U.repeat("*", minlevel - minfound);
          content = content.replace(headlineRgx, function(m){
            return starsToAppend + m;
          });
        }
      }

      // Generating the included content from the fetched lines
      var lines = content.split(/\r?\n/g);
      var result = [];
      var first = true;

      _.each(lines, function (v, idx) {
        if (idx < limitMin || idx > limitMax + 1) { return false; }
        var line = (beginend ? indent : '') + (first ? (prefix1 ? prefix1 : prefix) : prefix) + v;
        result.push(line);
        first = false;
      });

      result = result.join('\n');

      // Enclosing in a =BEGIN/END= block if needed
      if (beginend === 'src') {
        var begin = indent + '#+BEGIN_SRC ';
        if(srcType){begin += srcType + ' ';}
        begin += '\n';
        result = begin + 
                 result.replace(/#\+END_SRC/ig, '\\#+END_SRC') + 
                 indent + '#+END_SRC\n';
      } else if(beginend === 'example'){
        result = indent + '#+BEGIN_EXAMPLE \n' + 
                 result.replace(/#\+END_EXAMPLE/ig, '\\#+END_EXAMPLE') + 
                 indent + '#+END_EXAMPLE\n';
      } else if(beginend === 'quote'){
        result = indent + '#+BEGIN_QUOTE \n' + 
                 result.replace(/#\+END_QUOTE/ig, '\\#+END_QUOTE') + 
                 indent + '#+END_QUOTE\n';
      }

      return result;

    });
  }
};

module.exports = exports = Include;
},{"./utils":4,"./block/lines":47}],12:[function(require,module,exports){
var _U      = require('./utils');
var Block   = require('./block');
var Section = require('./block/section');
var Config  = require('./config');
var Lines   = require('./block/lines');

var Include = require('./include');

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {
    init: function (org) {
      this.footnotes = [];
      this.org = org;
      delete this.parent;
    },
    declareFootnote: function (fndef) {
      var number = this.footnotes.length;
      this.footnotes[number] = fndef;
      fndef.number = number + 1;
    },
    footnoteByName: function (name) {
      var fn;
      _.each(this.footnotes, function (c) { 
        if (c.name === name) { fn = c; return false; }
      });
      return fn;
    }
  }
});

Document.parser = function (org) {
  org = org || new (require('./core'))();
  
  var conf = org.conf || Config.defaults;
  var numspace = +conf.get('tabSize');
  var tabspace = _U.repeat(' ', numspace);

  return function (txt) {
  
    var d = new Document(org);
    txt = new Include(d).replace(txt);
    txt = txt.replace(/\t/g, tabspace);
  
    var lines = new Lines(txt);
    lines.trimBlank();
    d.setProperties(lines.properties());
    d.consume(new Lines(txt));  
  
    return d;
  };
};

module.exports = exports = Document;
},{"./utils":4,"./config":6,"./block":3,"./block/lines":47,"./include":46,"./block/section":30,"./core":7}],10:[function(require,module,exports){
var _U       = require('./utils');
var _        = _U._;
var Lines    = require('./block/lines');
var TreeNode = require('./tree');

var Inline = function (parent) {
  TreeNode.call(this, parent);
};

_U.extendProto(Inline, TreeNode, {
  init         : function () {},
  document     : function () { return this.root(); }
});

//------------------------------------------------------------------------------

var prec = Inline.precedence = {};

/**
 * Allows to register a new Block constructor at a given precedence level.
 * @param  {Block} Constr the block constructor
 * @param  {String} level  the level name, must be present in Block.levels
 */
Inline.register = function (level, Constr) {
  if (prec[level]) {Inline.register(level + 1, Constr);}
  else { prec[level] = Constr; }
  return Constr;
};

//------------------------------------------------------------------------------

Inline.define = function (obj) {
  var Parent = obj.parent || Inline;
  var Result = function () {
    Parent.apply(this, arguments);
    this.type = obj.type;
    if (this.init) { this.init.apply(this, arguments); }
  };
  Result.type = obj.type;
  Result.replace = obj.replace || Parent.replace || function () { return ""; };
  _.assign(Result, obj.attrs);
  _U.extendProto(Result, Parent, obj.methods);
  return Result;
};

//------------------------------------------------------------------------------

Inline.parser = function (conf) {
  return function (lines, parent, tp, tokens) {
    var raw = _.isString(lines) ? lines : new Lines(lines).asString();
    var txt = raw;

    tp = tp || _U.absentToken(txt);
    tokens = tokens || {};
    _.each(_U.ordered(prec), function(Constr){ 
      txt = Constr.replace(txt, parent, tp, tokens);
    });

    var result = [];
    txt.replace(new RegExp(tp + ':\\d+;', 'g'), function (m) {
      result.push(tokens[m]);
      return "";
    });
    return result;
  };
};

//------------------------------------------------------------------------------

module.exports = exports = Inline;
},{"./utils":4,"./tree":5,"./block/lines":47}],4:[function(require,module,exports){
(function(){require('./shim');

dependency = function (name, alternate) {
  var global = (function(){return this;}());
  return global[name] || (alternate && global[alternate]) || require(name);
};

var _ = dependency('lodash', '_');

var _U = {
  dependency: dependency,
  _ : _,

  ordered: function (obj) {
    var result = [];
    var keys = _.sortBy(_.keys(obj), function (i) { return +i; });
    _.each(keys, function (k) { result.push(obj[k]); });
    return result;
  },

  load: function (location) {
    var result = "";
    if (XMLHttpRequest) {
      var request = new XMLHttpRequest();
      request.open('GET', location, false);
      request.send(null);
      if (request.status === 200) { result = request.responseText; }
      else {result = "Status " + request.status + " on " + location; }
    } else if (req('fs')) {
      // Else pretend we're in node.js...
      result = req('fs').readFileSync(location);
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
  },

  log: {
    debug: function () {
      if (console && console.debug) {
        console.debug.apply(console, arguments);
      }
    },
    info: function () {
      if (console && console.info) {
        console.info.apply(console, arguments);
      }
    },
    error: function () {
      if (console && console.error) {
        console.error.apply(console, arguments);
      }
    }
  },

  path: {

    parent: function (path) {
      path = _U.trim('' + path);
      var split = path.split(/\//);
      if(_U.blank(split.pop())){
        split.pop();
      }
      return split.join('/') + '/';
    },

    join: function () {
      var idx;
      var args = Array.prototype.slice.call(arguments);
      var max = args.length;
      var result = args.join('/').replace(/\/+/g, '/').replace(/\/\.\//g, '/');
      return result;
    }
  },

  rgxp: {
    propLine: /^\s*#\+([A-Z_]+)\+?:\s*([\S\s]*?)\s*$/i
  }
  
};



/**
 * An easily callable incrementor.
 * @type {Function}
 */
_U.id = _U.incrementor();

module.exports = exports = _U;
})()
},{"./shim":2}],5:[function(require,module,exports){
var _U = require('./utils');
var _  = _U._;

var TreeNode = function(parent){
  this.isTreeNode = true;
  this.parent     = parent || null;
  this.id         = _U.id();
  this.properties = {};
  this._children  = [];
};

TreeNode.prototype = {

  setProperties: function (obj) {
    _.assign(this.properties, obj);
    // TODO: treat the '+' suffix for property names to append to an 
    //       existing property 
  },

  rootOrg: function () {
    var doc = this.document();
    return (doc && doc.org) ? doc.org : new (require('./core'))();
  },

  config: function () {
    return this.rootOrg().config;
  },

  parseHeadline: function (line) {
    return this.rootOrg().parse.headline(line, this);
  },

  parseInline: function (txt, tp, tokens) {
    return this.rootOrg().parse.inline(txt, this, tp, tokens);
  },

  parseDocument: function (location) {
    return this.rootOrg().parseDocumentAt(location);
  },

  document: function () {     
    var current = this;
    while (current) {
      if (current.type === 'document') {
        return current;
      } else {
        current = current.parent;
      }
    }
  },

  section: function () {
    var current = this;
    while (current) {
      if (current.type === 'section' || current.type === 'document') {
        return current;
      } else {
        current = current.parent;
      }
    }
  },

  ancestors: function(){
    var result = [];
    var parent = this.parent;
    while (parent !== null) {
      result.push(parent);
      parent = parent.parent;
    }
    return result;
  },

  root: function(){
    var result = [];
    var parent = this;
    while (!!parent) {
      result.push(parent);
      if (!parent.parent) { return parent; }
      parent = parent.parent;
    }
    return parent;
  },

  children: function(){ return this._children; },

  leaf: function(){return this._children.length > 0;},
  
  siblings: function(){
    var all = this.siblingsAll(),
        id = this.id;
    return _.filter(all, function(v){return v.id !== id;});
  },
  
  siblingsAll: function(){
    return this.parent ? this.parent._children : [this];
  },

  prev: function(){
    var idx, candidate, prev = null;
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      candidate = siblings[idx];
      if(candidate.id === this.id){
        return prev;
      }
      prev = candidate;
    }
    return null;
  },
  
  prevAll: function(){
    var idx, candidate, result = [];
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      candidate = siblings[idx];
      if(candidate.id === this.id){
        return result;
      } else {
        result.push(candidate);
      }
    }
    return result;
  },
  
  next: function(){
    var idx, candidate, ok = false;
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      if(ok){return siblings[idx];}
      else {
        candidate = siblings[idx];
        if(candidate.id === this.id){
         ok = true;
        }
      }
    }
    return null;
  },
  
  nextAll: function(){
    var idx, candidate, ok = false, result = [];
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      if(ok){result.push(siblings[idx]);}
      else {
        candidate = siblings[idx];
        if(candidate.id === this.id){
         ok = true;
        }
      }
    }
    return result;
  },

  append: function(child){
    if (_.isArray(child)) {
      _.each(child, _.bind(this.append, this));
    } else {
      this._children.push(child);
      child.parent = this;
    }
  },

  prepend: function(child){
    if (_.isArray(child)) {
      _.each(child, _.bind(this.prepend, this));
    } else {
      this._children.unshift(child);
      child.parent = this;
    }
  },

  replace: function(child, nodearr){
    var position = this._children.indexOf(child);
    var siblings = this._children;
    var result = [];
    result = result.concat(siblings.slice(0, position), nodearr, siblings.slice(position + 1));
    this._children = result;
  }

};

module.exports = exports = TreeNode;
},{"./utils":4,"./core":7}],48:[function(require,module,exports){
(function() {
  var Org;

  Org = require('../src/core');

  describe('Org.parse', function() {
    var txt;

    txt = "#+TITLE: Test document\n\nVisit me please at http://hegemonikon.org/page\\. You may find that /intriguing/.\n\nThe \\alpha and the \\omega.\n\nWant some $maths?$? Or some =crazy *code* test[fn:1]?=.\n\nThis _is *a* /test/ document[fn:1]_.\n\n[fn:1] It should be put in its own file. \n       But whatever.\n\n* Work\n** TODO Test the footnotes\n   This section should contain footnotes[fn::Even inline ones.].\n\n   This line contains a simple reference to the first footnote[fn:1].\n\n** TODO Put the test document in its own file";
    return it('should parse correctly', function() {
      var doc, org, parser;

      org = new Org();
      parser = org.parse.document;
      doc = parser(txt);
      return expect(!!doc).toBe(true);
    });
  });

  describe('Org.config', function() {
    it('should accept the headline TODO configuration', function() {
      var headline, org, parser, result;

      org = new Org({
        headlineTodos: ['WORK']
      });
      headline = '* WORK [#C] Some work to do :work:';
      parser = org.parse.headline;
      result = parser(headline);
      return expect(result.todo).toEqual('WORK');
    });
    return it('should accept the headline PRIORITIES configuration', function() {
      var headline, org, parser, result;

      org = new Org({
        headlinePriorities: ['D']
      });
      headline = '* TODO [#D] Some work to do :work:';
      parser = org.parse.headline;
      result = parser(headline);
      return expect(result.priority).toEqual('D');
    });
  });

}).call(this);


},{"../src/core":7}],49:[function(require,module,exports){
var _U      = require('../utils');
var Block   = require('../block');

var Content = function (parent) {
  Block.call(this, parent);
  this.type = 'content';
};

_U.extendProto(Content, Block, {
  consume: function (lines) {
    lines.trimBlank();
    var next = 1;
    while (next && lines.length() > 0) {
      next = new (Block.get(lines))(this);
      if (next) {
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      }
    }
  }
});

module.exports = exports = Content;
},{"../utils":4,"../block":3}],16:[function(require,module,exports){
var _U    = require('../utils');
var Block = require('../block');

var rgxp = /^\s*\[\[([^\]]+(?:png|jpe?g|gif))\]\]\s*$/i;

var Illust = Block.define({
  type: 'illust',
  match: function (lines, parent) {
    var line = lines.peakOverProperties();
    return line.match(rgxp);
  },
  methods: {
    prepare: function (lines) {  },
    consume: function (lines) {
      var props = lines.properties();
      this.setProperties(props);
      var line = this.raw = lines.pop();
      this.url = rgxp.exec(line)[1];
    }
  }
});

module.exports = exports = Illust;
},{"../utils":4,"../block":3}],11:[function(require,module,exports){
var _U     = require('../utils');
var Config = require('../config');
var Org    = require('../core');
var Block  = require('../block');

var Headline = Block.define({
  type: 'headline',
  methods: {
    make: function (m) {
      this.raw      = m[0];
      this.stars    = m[1];
      this.level    = this.stars.length;
      this.todo     = m[2];
      this.priority = m[3];
      this.title    = this.parseInline(m[4]);
      this.tags     = m[5] ? m[5].split(/:/) : [];
      return this;
    }
  }
});

Headline.parser = function (org) {
  org = org || new Org();
  var config = org.config || Config.defaults;
  
  var todos = config.headlineTodos;
  var priorities = config.headlinePriorities;

  // Build the regexp
  var str = "(\\**)%s+";
  str += "(?:(%TODOS)%s+)?";
  str += "(?:\\[\\#(%PRIORITIES)\\]%s+)?";
  str += "(.*?)%s*";
  str += "(?:%s+:([A-Za-z0-9:]+):%s*)?";
  str += "(?:\n|$)";

  str = str.replace(/%TODOS/, todos.join('|'));
  str = str.replace(/%PRIORITIES/, priorities.join('|'));
  str = str.replace(/%s/g, '[ \\t]');

  var rgxp = RegExp(str);

  return function (line, parent) {
    var matcher = rgxp.exec(line);
    return matcher ? new Headline(parent).make(matcher) : null;
  };
};

module.exports = exports = Headline;
},{"../utils":4,"../core":7,"../block":3,"../config":6}],47:[function(require,module,exports){
var _U = require('../utils');
var _  = _U._;

/**
 * Lines constructor
 * @param {String|Array} text either a string which will be split into lines,
 *                            or an array of lines in reverse order.
 */
var Lines = function (text) {
  if (text.constructor === Lines) {
    this.arr = text.arr;
  } else if (_.isArray(text)) {
    this.arr = text;
  } else if (_.isString(text)) {
    this.arr = text.split(/\r?\n/g).reverse();
  } else {
    this.arr = [];
  }
};

Lines.ensure = function (o) {
  return o.constructor === Lines ? o : new Lines(o);
};

Lines.prototype = {
  length  : function () { return this.arr.length; },
  
  rest    : function () { return this.arr.slice().reverse(); },
  asArray : function () { return this.rest(); },
  
  text    : function () { return this.arr.reverse().join('\n'); },
  asString: function () { return this.text(); },
  
  peak    : function () { return this.arr[this.arr.length - 1]; },
  pop     : function () { return this.arr.pop(); },

  /**
   * Returns a new Lines object containing all lines popped from this, until
   * they do not match the given matcher function/regexp anymore.
   *
   * The lines in the result are really popped from this, so they are not in
   * this anymore.
   * 
   * @param  {Function|RegExp} matcher the matcher
   * @return {Lines}           a new lines object.
   */
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
    return new Lines(result.reverse());
  },

  /**
   * Same as popWhile, except that it pops all lines until the match the given
   * function/regexp.
   * 
   * @param  {Function|RegExp} matcher the matcher
   * @return {Lines}           a new lines object.
   */
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

  properties: function () {
    var result    = {};
    var propRgxp  = _U.rgxp.propLine;
    var propLines = this.popWhile(propRgxp);
    propLines.each(function (l) {
      var m = l.match(propRgxp);
      var name = m[1].toLowerCase();
      var value = m[2];
      result[name] = value;
    });
    return result;
  },

  /**
   * Return the next line which is not 
   * @return {[type]} [description]
   */
  peakOverProperties: function () {
    var lines    = this.asArray();
    var propRgxp = _U.rgxp.propLine;
    var result   = '';
    _.each(lines, function (l) {
      if (!l.match(propRgxp)) { 
        result = l;
        return false;
      }
    });
    return result;
  },

  push: function (arg) {
    if (_.isString(arg)) {
      this.arr.push(arg);
    } else if (_.isArray(arg)) {
      this.arr = this.arr.concat(arg);
    } else {
      this.arr.push('');
    }
  },

  each: function (fn) {
    _.each(this.asArray(), fn);
  }
};

module.exports = exports = Lines;
},{"../utils":4}],36:[function(require,module,exports){
var _U      = require('../utils');
var Block   = require('../block');
var Lines   = require('./lines');

var Para = Block.define({
  parent: Block,
  type: "para",
  match: function (lines, parent) {
    return true;
  },
  methods: {
    init: function () {
      this.lines = [];
    },
    accepts: function (lines) {
      var line = lines.peak();
      // Check for empty line
      if (_U.blank(line)) { return false; }

      // Check for other type of line
      var testType = _U.ensure(Block.get(lines)).type;
      if (testType !== "para") { return false; }

      // Check for indentation
      var indent = _U.indentLevel(line);
      var parentIndent = this.parentIndent();
      if (indent === 0 && parentIndent > 0) {return false;}
      if (indent > 0 && indent < parentIndent) {return false;}
      return true;
    },
    consume: function (lines) {
      do {
        this.lines.push(lines.pop());
      } while (this.accepts(lines));
      lines.trimBlank();

      this.append(this.parseInline(this.lines.join('\n')));
    }
  }
});

module.exports = exports = Para;
},{"../utils":4,"../block":3,"./lines":47}],30:[function(require,module,exports){
var _U = require('../utils');
var _  = _U._;

var Block    = require('../block');
var Content  = require('./content');

var Section = function (parent) {
  Block.call(this, parent);
  this.type = "section";
};

Section.match = function (lines) {
  var line = _U.peak(lines);
  return !!(line && /^\*/.exec(line));
};

_U.extendProto(Section, Block, {
  accepts: function (lines) {
    if (lines.length() === 0) {return false;}
    var line = lines.peak();
    var headline = this.parseHeadline(line);
    var level = headline.level;
    return (level > this.level);
  },
  consume: function (lines) {
    if (Section.match(lines)) {
      var line = lines.pop();
      this.headline = this.parseHeadline(line);
      this.level = this.headline.level;
    } else {
      this.level = 0;
    }

    var contentLines = lines.popUntil(Section.match);
    this.content = new Content(this);
    this.content.consume(contentLines);

    while (this.accepts(lines)) {
      var child = new Section(this);
      this.append(child);
      child.consume(lines);
    }

  }
});

module.exports = exports = Section;
},{"../utils":4,"../block":3,"./content":49}],39:[function(require,module,exports){
var _U     = require('../utils');
var Inline = require('../inline');

var Entity = Inline.define({
  type: 'entity',
  replace: function (txt, parent, tp, tokens) {
    txt = txt.replace(/\\([a-z]+\d*)\b/g, function (m, e) {
      if (!Entity.store[e]) { return m; }
      var entity     = new Entity(parent);
      entity.raw     = m;
      entity.content = Entity.store[e];
      var token      = _U.newToken(tp);
      tokens[token]  = entity;
      return token;
    });
    return txt;
  }
});

Entity.store = {};

var define = function () {
  var a = arguments;
  Entity.store[a[0]] = {
    latex : a[1],
    html  : a[2],
    ascii : a[3],
    latin1: a[4],
    utf8  : a[5]
  };
};

//    "* Letters"
//    "** Latin"
define("Agrave","\\`{A}","&Agrave;","A","À","À");
define("agrave","\\`{a}","&agrave;","a","à","à");
define("Aacute","\\'{A}","&Aacute;","A","Á","Á");
define("aacute","\\'{a}","&aacute;","a","á","á");
define("Acirc","\\^{A}","&Acirc;","A","Â","Â");
define("acirc","\\^{a}","&acirc;","a","â","â");
define("Atilde","\\~{A}","&Atilde;","A","Ã","Ã");
define("atilde","\\~{a}","&atilde;","a","ã","ã");
define("Auml","\\\"{A}","&Auml;","Ae","Ä","Ä");
define("auml","\\\"{a}","&auml;","ae","ä","ä");
define("Aring","\\AA{}","&Aring;","A","Å","Å");
define("AA","\\AA{}","&Aring;","A","Å","Å");
define("aring","\\aa{}","&aring;","a","å","å");
define("AElig","\\AE{}","&AElig;","AE","Æ","Æ");
define("aelig","\\ae{}","&aelig;","ae","æ","æ");
define("Ccedil","\\c{C}","&Ccedil;","C","Ç","Ç");
define("ccedil","\\c{c}","&ccedil;","c","ç","ç");
define("Egrave","\\`{E}","&Egrave;","E","È","È");
define("egrave","\\`{e}","&egrave;","e","è","è");
define("Eacute","\\'{E}","&Eacute;","E","É","É");
define("eacute","\\'{e}","&eacute;","e","é","é");
define("Ecirc","\\^{E}","&Ecirc;","E","Ê","Ê");
define("ecirc","\\^{e}","&ecirc;","e","ê","ê");
define("Euml","\\\"{E}","&Euml;","E","Ë","Ë");
define("euml","\\\"{e}","&euml;","e","ë","ë");
define("Igrave","\\`{I}","&Igrave;","I","Ì","Ì");
define("igrave","\\`{i}","&igrave;","i","ì","ì");
define("Iacute","\\'{I}","&Iacute;","I","Í","Í");
define("iacute","\\'{i}","&iacute;","i","í","í");
define("Icirc","\\^{I}","&Icirc;","I","Î","Î");
define("icirc","\\^{i}","&icirc;","i","î","î");
define("Iuml","\\\"{I}","&Iuml;","I","Ï","Ï");
define("iuml","\\\"{i}","&iuml;","i","ï","ï");
define("Ntilde","\\~{N}","&Ntilde;","N","Ñ","Ñ");
define("ntilde","\\~{n}","&ntilde;","n","ñ","ñ");
define("Ograve","\\`{O}","&Ograve;","O","Ò","Ò");
define("ograve","\\`{o}","&ograve;","o","ò","ò");
define("Oacute","\\'{O}","&Oacute;","O","Ó","Ó");
define("oacute","\\'{o}","&oacute;","o","ó","ó");
define("Ocirc","\\^{O}","&Ocirc;","O","Ô","Ô");
define("ocirc","\\^{o}","&ocirc;","o","ô","ô");
define("Otilde","\\~{O}","&Otilde;","O","Õ","Õ");
define("otilde","\\~{o}","&otilde;","o","õ","õ");
define("Ouml","\\\"{O}","&Ouml;","Oe","Ö","Ö");
define("ouml","\\\"{o}","&ouml;","oe","ö","ö");
define("Oslash","\\O","&Oslash;","O","Ø","Ø");
define("oslash","\\o{}","&oslash;","o","ø","ø");
define("OElig","\\OE{}","&OElig;","OE","OE","Œ");
define("oelig","\\oe{}","&oelig;","oe","oe","œ");
define("Scaron","\\v{S}","&Scaron;","S","S","Š");
define("scaron","\\v{s}","&scaron;","s","s","š");
define("szlig","\\ss{}","&szlig;","ss","ß","ß");
define("Ugrave","\\`{U}","&Ugrave;","U","Ù","Ù");
define("ugrave","\\`{u}","&ugrave;","u","ù","ù");
define("Uacute","\\'{U}","&Uacute;","U","Ú","Ú");
define("uacute","\\'{u}","&uacute;","u","ú","ú");
define("Ucirc","\\^{U}","&Ucirc;","U","Û","Û");
define("ucirc","\\^{u}","&ucirc;","u","û","û");
define("Uuml","\\\"{U}","&Uuml;","Ue","Ü","Ü");
define("uuml","\\\"{u}","&uuml;","ue","ü","ü");
define("Yacute","\\'{Y}","&Yacute;","Y","Ý","Ý");
define("yacute","\\'{y}","&yacute;","y","ý","ý");
define("Yuml","\\\"{Y}","&Yuml;","Y","Y","Ÿ");
define("yuml","\\\"{y}","&yuml;","y","ÿ","ÿ");

//    "** Latin (special face)"
define("fnof","\\textit{f}","&fnof;","f","f","ƒ");
define("real","\\Re","&real;","R","R","ℜ");
define("image","\\Im","&image;","I","I","ℑ");
define("weierp","\\wp","&weierp;","P","P","℘");

//    "** Greek"
define("Alpha","A","&Alpha;","Alpha","Alpha","Α");
define("alpha","\\alpha","&alpha;","alpha","alpha","α");
define("Beta","B","&Beta;","Beta","Beta","Β");
define("beta","\\beta","&beta;","beta","beta","β");
define("Gamma","\\Gamma","&Gamma;","Gamma","Gamma","Γ");
define("gamma","\\gamma","&gamma;","gamma","gamma","γ");
define("Delta","\\Delta","&Delta;","Delta","Gamma","Δ");
define("delta","\\delta","&delta;","delta","delta","δ");
define("Epsilon","E","&Epsilon;","Epsilon","Epsilon","Ε");
define("epsilon","\\epsilon","&epsilon;","epsilon","epsilon","ε");
define("varepsilon","\\varepsilon","&epsilon;","varepsilon","varepsilon","ε");
define("Zeta","Z","&Zeta;","Zeta","Zeta","Ζ");
define("zeta","\\zeta","&zeta;","zeta","zeta","ζ");
define("Eta","H","&Eta;","Eta","Eta","Η");
define("eta","\\eta","&eta;","eta","eta","η");
define("Theta","\\Theta","&Theta;","Theta","Theta","Θ");
define("theta","\\theta","&theta;","theta","theta","θ");
define("thetasym","\\vartheta","&thetasym;","theta","theta","ϑ");
define("vartheta","\\vartheta","&thetasym;","theta","theta","ϑ");
define("Iota","I","&Iota;","Iota","Iota","Ι");
define("iota","\\iota","&iota;","iota","iota","ι");
define("Kappa","K","&Kappa;","Kappa","Kappa","Κ");
define("kappa","\\kappa","&kappa;","kappa","kappa","κ");
define("Lambda","\\Lambda","&Lambda;","Lambda","Lambda","Λ");
define("lambda","\\lambda","&lambda;","lambda","lambda","λ");
define("Mu","M","&Mu;","Mu","Mu","Μ");
define("mu","\\mu","&mu;","mu","mu","μ");
define("nu","\\nu","&nu;","nu","nu","ν");
define("Nu","N","&Nu;","Nu","Nu","Ν");
define("Xi","\\Xi","&Xi;","Xi","Xi","Ξ");
define("xi","\\xi","&xi;","xi","xi","ξ");
define("Omicron","O","&Omicron;","Omicron","Omicron","Ο");
define("omicron","\\textit{o}","&omicron;","omicron","omicron","ο");
define("Pi","\\Pi","&Pi;","Pi","Pi","Π");
define("pi","\\pi","&pi;","pi","pi","π");
define("Rho","P","&Rho;","Rho","Rho","Ρ");
define("rho","\\rho","&rho;","rho","rho","ρ");
define("Sigma","\\Sigma","&Sigma;","Sigma","Sigma","Σ");
define("sigma","\\sigma","&sigma;","sigma","sigma","σ");
define("sigmaf","\\varsigma","&sigmaf;","sigmaf","sigmaf","ς");
define("varsigma","\\varsigma","&sigmaf;","varsigma","varsigma","ς");
define("Tau","T","&Tau;","Tau","Tau","Τ");
define("Upsilon","\\Upsilon","&Upsilon;","Upsilon","Upsilon","Υ");
define("upsih","\\Upsilon","&upsih;","upsilon","upsilon","ϒ");
define("upsilon","\\upsilon","&upsilon;","upsilon","upsilon","υ");
define("Phi","\\Phi","&Phi;","Phi","Phi","Φ");
define("phi","\\phi","&phi;","phi","phi","φ");
define("Chi","X","&Chi;","Chi","Chi","Χ");
define("chi","\\chi","&chi;","chi","chi","χ");
define("acutex","\\acute x","&acute;x","'x","'x","𝑥́");
define("Psi","\\Psi","&Psi;","Psi","Psi","Ψ");
define("psi","\\psi","&psi;","psi","psi","ψ");
define("tau","\\tau","&tau;","tau","tau","τ");
define("Omega","\\Omega","&Omega;","Omega","Omega","Ω");
define("omega","\\omega","&omega;","omega","omega","ω");
define("piv","\\varpi","&piv;","omega-pi","omega-pi","ϖ");
define("partial","\\partial","&part;","[partial differential]","[partial differential]","∂");

//    "** Hebrew"
define("alefsym","\\aleph","&alefsym;","aleph","aleph","ℵ");

//    "** Dead languages"
define("ETH","\\DH{}","&ETH;","D","Ð","Ð");
define("eth","\\dh{}","&eth;","dh","ð","ð");
define("THORN","\\TH{}","&THORN;","TH","Þ","Þ");
define("thorn","\\th{}","&thorn;","th","þ","þ");

//    "* Punctuation"
//    "** Dots and Marks"
define("dots","\\dots{}","&hellip;","...","...","…");
define("hellip","\\dots{}","&hellip;","...","...","…");
define("middot","\\textperiodcentered{}","&middot;",".","·","·");
define("iexcl","!`","&iexcl;","!","¡","¡");
define("iquest","?`","&iquest;","?","¿","¿");

//    "** Dash-like"
define("shy","\\-","&shy;","","","");
define("ndash","--","&ndash;","-","-","–");
define("mdash","---","&mdash;","--","--","—");

//    "** Quotations"
define("quot","\\textquotedbl{}","&quot;","\"","\"","\"");
define("acute","\\textasciiacute{}","&acute;","'","´","´");
define("ldquo","\\textquotedblleft{}","&ldquo;","\"","\"","“");
define("rdquo","\\textquotedblright{}","&rdquo;","\"","\"","”");
define("bdquo","\\quotedblbase{}","&bdquo;","\"","\"","„");
define("lsquo","\\textquoteleft{}","&lsquo;","`","`","‘");
define("rsquo","\\textquoteright{}","&rsquo;","'","'","’");
define("sbquo","\\quotesinglbase{}","&sbquo;",",",",","‚");
define("laquo","\\guillemotleft{}","&laquo;","<<","«","«");
define("raquo","\\guillemotright{}","&raquo;",">>","»","»");
define("lsaquo","\\guilsinglleft{}","&lsaquo;","<","<","‹");
define("rsaquo","\\guilsinglright{}","&rsaquo;",">",">","›");

//    "* Other"
//    "** Misc. (often used)"
define("circ","\\circ","&circ;","^","^","ˆ");
define("vert","\\vert{}","&#124;",",",",",",");
define("brvbar","\\textbrokenbar{}","&brvbar;",",","¦","¦");
define("sect","\\S","&sect;","paragraph","§","§");
define("amp","\\&","&amp;","&","&","&");
define("lt","\\textless{}","&lt;","<","<","<");
define("gt","\\textgreater{}","&gt;",">",">",">");
define("tilde","\\~{}","&tilde;","~","~","~");
define("dagger","\\textdagger{}","&dagger;","[dagger]","[dagger]","†");
define("Dagger","\\textdaggerdbl{}","&Dagger;","[doubledagger]","[doubledagger]","‡");

//    "** Whitespace"
define("nbsp","~","&nbsp;"," "," "," ");
define("ensp","\\hspace*{.5em}","&ensp;"," "," "," ");
define("emsp","\\hspace*{1em}","&emsp;"," "," "," ");
define("thinsp","\\hspace*{.2em}","&thinsp;"," "," "," ");

//    "** Currency"
define("curren","\\textcurrency{}","&curren;","curr.","¤","¤");
define("cent","\\textcent{}","&cent;","cent","¢","¢");
define("pound","\\pounds{}","&pound;","pound","£","£");
define("yen","\\textyen{}","&yen;","yen","¥","¥");
define("euro","\\texteuro{}","&euro;","EUR","EUR","€");
define("EUR","\\EUR{}","&euro;","EUR","EUR","€");
define("EURdig","\\EURdig{}","&euro;","EUR","EUR","€");
define("EURhv","\\EURhv{}","&euro;","EUR","EUR","€");
define("EURcr","\\EURcr{}","&euro;","EUR","EUR","€");
define("EURtm","\\EURtm{}","&euro;","EUR","EUR","€");

//    "** Property Marks"
define("copy","\\textcopyright{}","&copy;","(c)","©","©");
define("reg","\\textregistered{}","&reg;","(r)","®","®");
define("trade","\\texttrademark{}","&trade;","TM","TM","™");

//    "** Science et al."
define("minus","\\minus","&minus;","-","-","−");
define("pm","\\textpm{}","&plusmn;","+-","±","±");
define("plusmn","\\textpm{}","&plusmn;","+-","±","±");
define("times","\\texttimes{}","&times;","*","×","×");
define("frasl","/","&frasl;","/","/","⁄");
define("div","\\textdiv{}","&divide;","/","÷","÷");
define("frac12","\\textonehalf{}","&frac12;","1/2","½","½");
define("frac14","\\textonequarter{}","&frac14;","1/4","¼","¼");
define("frac34","\\textthreequarters{}","&frac34;","3/4","¾","¾");
define("permil","\\textperthousand{}","&permil;","per thousand","per thousand","‰");
define("sup1","\\textonesuperior{}","&sup1;","^1","¹","¹");
define("sup2","\\texttwosuperior{}","&sup2;","^2","²","²");
define("sup3","\\textthreesuperior{}","&sup3;","^3","³","³");
define("radic","\\sqrt{\\,}","&radic;","[square root]","[square root]","√");
define("sum","\\sum","&sum;","[sum]","[sum]","∑");
define("prod","\\prod","&prod;","[product]","[n-ary product]","∏");
define("micro","\\textmu{}","&micro;","micro","µ","µ");
define("macr","\\textasciimacron{}","&macr;","[macron]","¯","¯");
define("deg","\\textdegree{}","&deg;","degree","°","°");
define("prime","\\prime","&prime;","'","'","′");
define("Prime","\\prime{}\\prime","&Prime;","''","''","″");
define("infin","\\propto","&infin;","[infinity]","[infinity]","∞");
define("infty","\\infty","&infin;","[infinity]","[infinity]","∞");
define("prop","\\propto","&prop;","[proportional to]","[proportional to]","∝");
define("proptp","\\propto","&prop;","[proportional to]","[proportional to]","∝");
define("not","\\textlnot{}","&not;","[angled dash]","¬","¬");
define("land","\\land","&and;","[logical and]","[logical and]","∧");
define("wedge","\\wedge","&and;","[logical and]","[logical and]","∧");
define("lor","\\lor","&or;","[logical or]","[logical or]","∨");
define("vee","\\vee","&or;","[logical or]","[logical or]","∨");
define("cap","\\cap","&cap;","[intersection]","[intersection]","∩");
define("cup","\\cup","&cup;","[union]","[union]","∪");
define("int","\\int","&int;","[integral]","[integral]","∫");
define("there4","\\therefore","&there4;","[therefore]","[therefore]","∴");
define("sim","\\sim","&sim;","~","~","∼");
define("cong","\\cong","&cong;","[approx. equal to]","[approx. equal to]","≅");
define("simeq","\\simeq","&cong;","[approx. equal to]","[approx. equal to]","≅");
define("asymp","\\asymp","&asymp;","[almost equal to]","[almost equal to]","≈");
define("approx","\\approx","&asymp;","[almost equal to]","[almost equal to]","≈");
define("ne","\\ne","&ne;","[not equal to]","[not equal to]","≠");
define("neq","\\neq","&ne;","[not equal to]","[not equal to]","≠");
define("equiv","\\equiv","&equiv;","[identical to]","[identical to]","≡");
define("le","\\le","&le;","<=","<=","≤");
define("ge","\\ge","&ge;",">=",">=","≥");
define("sub","\\subset","&sub;","[subset of]","[subset of]","⊂");
define("subset","\\subset","&sub;","[subset of]","[subset of]","⊂");
define("sup","\\supset","&sup;","[superset of]","[superset of]","⊃");
define("supset","\\supset","&sup;","[superset of]","[superset of]","⊃");
define("nsub","\\not\\subset","&nsub;","[not a subset of]","[not a subset of","⊄");
define("sube","\\subseteq","&sube;","[subset of or equal to]","[subset of or equal to]","⊆");
define("nsup","\\not\\supset","&nsup;","[not a superset of]","[not a superset of]","⊅");
define("supe","\\supseteq","&supe;","[superset of or equal to]","[superset of or equal to]","⊇");
define("forall","\\forall","&forall;","[for all]","[for all]","∀");
define("exist","\\exists","&exist;","[there exists]","[there exists]","∃");
define("exists","\\exists","&exist;","[there exists]","[there exists]","∃");
define("empty","\\empty","&empty;","[empty set]","[empty set]","∅");
define("emptyset","\\emptyset","&empty;","[empty set]","[empty set]","∅");
define("isin","\\in","&isin;","[element of]","[element of]","∈");
define("in","\\in","&isin;","[element of]","[element of]","∈");
define("notin","\\notin","&notin;","[not an element of]","[not an element of]","∉");
define("ni","\\ni","&ni;","[contains as member]","[contains as member]","∋");
define("nabla","\\nabla","&nabla;","[nabla]","[nabla]","∇");
define("ang","\\angle","&ang;","[angle]","[angle]","∠");
define("angle","\\angle","&ang;","[angle]","[angle]","∠");
define("perp","\\perp","&perp;","[up tack]","[up tack]","⊥");
define("sdot","\\cdot","&sdot;","[dot]","[dot]","⋅");
define("cdot","\\cdot","&sdot;","[dot]","[dot]","⋅");
define("lceil","\\lceil","&lceil;","[left ceiling]","[left ceiling]","⌈");
define("rceil","\\rceil","&rceil;","[right ceiling]","[right ceiling]","⌉");
define("lfloor","\\lfloor","&lfloor;","[left floor]","[left floor]","⌊");
define("rfloor","\\rfloor","&rfloor;","[right floor]","[right floor]","⌋");
define("lang","\\langle","&lang;","<","<","⟨");
define("rang","\\rangle","&rang;",">",">","⟩");

//    "** Arrows"
define("larr","\\leftarrow","&larr;","<-","<-","←");
define("leftarrow","\\leftarrow","&larr;","<-","<-","←");
define("gets","\\gets","&larr;","<-","<-","←");
define("lArr","\\Leftarrow","&lArr;","<=","<=","⇐");
define("Leftarrow","\\Leftarrow","&lArr;","<=","<=","⇐");
define("uarr","\\uparrow","&uarr;","[uparrow]","[uparrow]","↑");
define("uparrow","\\uparrow","&uarr;","[uparrow]","[uparrow]","↑");
define("uArr","\\Uparrow","&uArr;","[dbluparrow]","[dbluparrow]","⇑");
define("Uparrow","\\Uparrow","&uArr;","[dbluparrow]","[dbluparrow]","⇑");
define("rarr","\\rightarrow","&rarr;","->","->","→");
define("to","\\to","&rarr;","->","->","→");
define("rightarrow","\\rightarrow","&rarr;","->","->","→");
define("rArr","\\Rightarrow","&rArr;","=>","=>","⇒");
define("Rightarrow","\\Rightarrow","&rArr;","=>","=>","⇒");
define("darr","\\downarrow","&darr;","[downarrow]","[downarrow]","↓");
define("downarrow","\\downarrow","&darr;","[downarrow]","[downarrow]","↓");
define("dArr","\\Downarrow","&dArr;","[dbldownarrow]","[dbldownarrow]","⇓");
define("Downarrow","\\Downarrow","&dArr;","[dbldownarrow]","[dbldownarrow]","⇓");
define("harr","\\leftrightarrow","&harr;","<->","<->","↔");
define("leftrightarrow","\\leftrightarrow","&harr;","<->","<->","↔");
define("hArr","\\Leftrightarrow","&hArr;","<=>","<=>","⇔");
define("Leftrightarrow","\\Leftrightarrow","&hArr;","<=>","<=>","⇔");
define("crarr","\\hookleftarrow","&crarr;","<-'","<-'","↵");
define("hookleftarrow","\\hookleftarrow","&crarr;","<-'","<-'","↵");

//    "** Function names"
define("arccos","\\arccos","arccos","arccos","arccos","arccos");
define("arcsin","\\arcsin","arcsin","arcsin","arcsin","arcsin");
define("arctan","\\arctan","arctan","arctan","arctan","arctan");
define("arg","\\arg","arg","arg","arg","arg");
define("cos","\\cos","cos","cos","cos","cos");
define("cosh","\\cosh","cosh","cosh","cosh","cosh");
define("cot","\\cot","cot","cot","cot","cot");
define("coth","\\coth","coth","coth","coth","coth");
define("csc","\\csc","csc","csc","csc","csc");
define("deg","\\deg","&deg;","deg","deg","deg");
define("det","\\det","det","det","det","det");
define("dim","\\dim","dim","dim","dim","dim");
define("exp","\\exp","exp","exp","exp","exp");
define("gcd","\\gcd","gcd","gcd","gcd","gcd");
define("hom","\\hom","hom","hom","hom","hom");
define("inf","\\inf","inf","inf","inf","inf");
define("ker","\\ker","ker","ker","ker","ker");
define("lg","\\lg","lg","lg","lg","lg");
define("lim","\\lim","lim","lim","lim","lim");
define("liminf","\\liminf","liminf","liminf","liminf","liminf");
define("limsup","\\limsup","limsup","limsup","limsup","limsup");
define("ln","\\ln","ln","ln","ln","ln");
define("log","\\log","log","log","log","log");
define("max","\\max","max","max","max","max");
define("min","\\min","min","min","min","min");
define("Pr","\\Pr","Pr","Pr","Pr","Pr");
define("sec","\\sec","sec","sec","sec","sec");
define("sin","\\sin","sin","sin","sin","sin");
define("sinh","\\sinh","sinh","sinh","sinh","sinh");
define("sup","\\sup","&sup;","sup","sup","sup");
define("tan","\\tan","tan","tan","tan","tan");
define("tanh","\\tanh","tanh","tanh","tanh","tanh");

//    "** Signs & Symbols"
define("bull","\\textbullet{}","&bull;","*","*","•");
define("bullet","\\textbullet{}","&bull;","*","*","•");
define("star","\\star","*","*","*","⋆");
define("lowast","\\ast","&lowast;","*","*","∗");
define("ast","\\ast","&lowast;","*","*","*");
define("odot","\\odot","o","[circled dot]","[circled dot]","ʘ");
define("oplus","\\oplus","&oplus;","[circled plus]","[circled plus]","⊕");
define("otimes","\\otimes","&otimes;","[circled times]","[circled times]","⊗");
define("checkmark","\\checkmark","&#10003;","[checkmark]","[checkmark]","✓");

//    "** Miscellaneous (seldom used)"
define("para","\\P{}","&para;","[pilcrow]","¶","¶");
define("ordf","\\textordfeminine{}","&ordf;","_a_","ª","ª");
define("ordm","\\textordmasculine{}","&ordm;","_o_","º","º");
define("cedil","\\c{}","&cedil;","[cedilla]","¸","¸");
define("oline","\\overline{~}","&oline;","[overline]","¯","‾");
define("uml","\\textasciidieresis{}","&uml;","[diaeresis]","¨","¨");
define("zwnj","\\/{}","&zwnj;","","","");
define("zwj","","&zwj;","","","");
define("lrm","","&lrm;","","","");
define("rlm","","&rlm;","","","");

//    "** Smilies"
define("smile","\\smile","&#9786;",":-)",":-)","⌣");
define("smiley","\\smiley{}","&#9786;",":-)",":-)","☺");
define("blacksmile","\\blacksmiley{}","&#9787;",":-)",":-)","☻");
define("sad","\\frownie{}","&#9785;",":-(",":-(","☹");

//    "** Suits"
define("clubs","\\clubsuit","&clubs;","[clubs]","[clubs]","♣");
define("clubsuit","\\clubsuit","&clubs;","[clubs]","[clubs]","♣");
define("spades","\\spadesuit","&spades;","[spades]","[spades]","♠");
define("spadesuit","\\spadesuit","&spades;","[spades]","[spades]","♠");
define("hearts","\\heartsuit","&hearts;","[hearts]","[hearts]","♥");
define("heartsuit","\\heartsuit","&heartsuit;","[hearts]","[hearts]","♥");
define("diams","\\diamondsuit","&diams;","[diamonds]","[diamonds]","♦");
define("diamondsuit","\\diamondsuit","&diams;","[diamonds]","[diamonds]","♦");
define("Diamond","\\diamond","&diamond;","[diamond]","[diamond]","⋄");
define("loz","\\diamond","&loz;","[lozenge]","[lozenge]","◊");

module.exports = exports = Entity;
},{"../utils":4,"../inline":10}],35:[function(require,module,exports){
var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var Latex = Inline.define({
  type: 'latex',
  replace: function (txt, parent, tp, tokens) {
    var regexps = [
      /(^|[\s\S]*[^\\])((\$\$)([\s\S]*?[^\\])\$\$)/g,
      /(^|[\s\S]*[^\\])((\$)([^\s][\s\S]*?[^\s\\]|[^\s\\])\$)/g,
      /(^|[\s\S]*[^\\])((\\\()([\s\S]*?[^\\])\\\))/g,
      /(^|[\s\S]*[^\\])((\\\[)([\s\S]*?[^\\])\\\])/g
    ];
    _.each(regexps, function (rgxp) {
      var replaceFn = function () {
        var a     = arguments;
        var pre   = a[1];
        var raw   = a[2];
        var type  = a[3] || "";
        var inner = a[4] || "";
        var token = "";
        if (raw) {
          var latex     = new Latex(parent);
          latex.raw     = raw;
          latex.content = inner;
          token         = _U.newToken(tp);
          tokens[token] = latex;
        }
        return pre + token;
      };
      do {
        txt = txt.replace(rgxp, replaceFn);
      } while (rgxp.exec(txt));
    });
    return txt;
  }
});

module.exports = exports = Latex;


},{"../inline":10,"../utils":4}],43:[function(require,module,exports){
var _U = require('../utils');
var Inline = require('../inline');

var emphRgxp = /(^|[\s\S]*[^\\])(([\/*+_])([^\s][\s\S]*?[^\s\\]|[^\s\\])\3)/g;

var Emphasis = Inline.define({
  type: 'emphasis',
  replace: function (txt, parent, tp, tokens) {
    var matcher;
    var replaceFn = function () {
      var a     = arguments;
      var pre   = a[1];
      var raw   = a[2];
      var type  = a[3] || "";
      var inner = a[4] || "";
      var token = "";
      if (raw) {
        var EmphConstr = Emphasis.types[type];
        var emph       = new EmphConstr(parent);
        emph.raw       = raw;
        emph.append(emph.parseInline(inner, tp, tokens));
        token          = _U.newToken(tp);
        tokens[token]  = emph;
      }
      return pre + token;
    };
    do {
      txt = txt.replace(emphRgxp, replaceFn);
      matcher = emphRgxp.exec(txt);
    } while (matcher);
    return txt;
  }
});

var define = function (type) {
  return Inline.define({
    'parent': Emphasis, 
    'type'  : type
  });
};

Emphasis.types = {
  '/': Emphasis,
  '*': define('strong'),
  '_': define('underline'),
  '+': define('strike')
};

module.exports = exports = Emphasis;
},{"../utils":4,"../inline":10}],40:[function(require,module,exports){
var _U     = require('../utils');
var Inline = require('../inline');
var FnDef  = require('../block/special/fndef');
var Lines  = require('../block/lines');

var fnrefRgxp = /\[(?:(\d+)|fn:([^:]*)(?::([\s\S]+?))?)\]/g;

var FnRef = Inline.define({
  type: 'fnref',
  replace: function (txt, parent, tp, tokens) {
    return txt.replace(fnrefRgxp, function () {
      var a    = arguments;
      var raw  = a[0];
      var name = a[2] || a[1];

      if (a[3]) {
        var def = a[3];
        var doc = parent.document();
        var fnDef = new FnDef(parent);
        name = "anon_" + _U.randomStr(5);
        fnDef.consume(new Lines(_U.join('[fn:', name, '] ', def)));
      }

      var fn = new FnRef(parent);
      fn.define(raw, name);

      var fnToken = _U.newToken(tp);
      tokens[fnToken] = fn;
      return fnToken;
    });
  },
  methods: {
    define: function (raw, name) {
      this.raw = raw;
      this.name = name;
    }
  }
});

module.exports = exports = FnRef;
},{"../inline":10,"../block/lines":47,"../block/special/fndef":18,"../utils":4}],44:[function(require,module,exports){
var _U     = require('../utils');
var Inline = require('../inline');

var Linebreak = Inline.define({
  type: 'linebreak',
  replace: function (txt, parent, tp, tokens) {
    txt = txt.replace(/\\\\$/mg, function (m, e) {
      var lb        = new Linebreak(parent);
      var token     = _U.newToken(tp);
      tokens[token] = lb;
      return token;
    });
    return txt;
  }
});

module.exports = exports = Linebreak;
},{"../utils":4,"../inline":10}],34:[function(require,module,exports){
var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var linkDescRgxp   = /\[\[(\S*?[^\s\\])\](?:\[([\s\S]*[^\\])\])?\]/g;
var linkBareRgxp   = /((?:http|https|ftp|mailto|file|news|shell|elisp|doi|message):(?:[\w\.\/\?\*\+#@!$&'_~:,;=-]|%[\dA-F]{2})+)/ig;

var Link = Inline.define({
  type: 'link',
  replace: function (txt, parent, tp, tokens) {
    var replaceFn = function (raw, uri, desc) {
      var token     = "";
      var link      = new Link(parent);
      link.raw      = raw;
      link.target   = uri ? uri : raw;
      link.desc     = desc ? link.parseInline(desc) : null;
      token         = _U.newToken(tp);
      tokens[token] = link;
      return token;
    };
    // Full described link
    txt = txt.replace(linkDescRgxp, replaceFn);
    // Bare
    txt = txt.replace(linkBareRgxp, replaceFn);
    return txt;
  }
});

module.exports = exports = Link;

},{"../inline":10,"../utils":4}],45:[function(require,module,exports){
var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var Regular = Inline.define({
  type: 'regular',
  replace: function (txt, parent, tp, tokens) {
    var tknRgxp = new RegExp(tp + ':\\d+;', 'g');
    var pieces = txt.split(tknRgxp);
    _.each(pieces, function (p) {
      if (p.length === 0) {return;}
      var reg = new Regular(parent);
      reg.content = p;
      var regToken = _U.newToken(tp);
      tokens[regToken] = reg;
      txt = txt.replace(p, regToken);
    });
    return txt;
  }
});

module.exports = exports = Regular;
},{"../inline":10,"../utils":4}],42:[function(require,module,exports){
var _U     = require('../utils');
var Inline = require('../inline');
var Sub    = require('./sub');

var Sup = Inline.define({
  parent: Sub,
  type: 'sup',
  attrs: {
    rgxp: /(\S)\^(?:(\*|[+-]?\w+)|\{([^\}]*)\})/g
  }
});

module.exports = exports = Sup;
},{"../inline":10,"./sub":41,"../utils":4}],38:[function(require,module,exports){
var _U = require('../utils');
var Inline = require('../inline');

var verbRgxp = /(^|[\s\S]*[^\\])(([=~])([^\s][\s\S]*?[^\s\\]|[^\s\\])\3)/g;

var verbTypes = {};

var Verbatim = verbTypes['~'] = Inline.define({
  type: 'verbatim',
  replace: function (txt, parent, tp, tokens) {
    var replaceFn = function () {
      var a     = arguments;
      var pre   = a[1];
      var raw   = a[2];
      var type  = a[3] || "";
      var inner = a[4] || "";
      var tknRgxp = new RegExp(tp + ':\\d+;', 'g');
      inner = inner.replace(tknRgxp, function (m) {
        var dest = tokens[m];
        if (dest.raw) {return dest.raw;}
        return m;
      });

      var token = "";
      if (raw) {
        var VerbConstr = verbTypes[type];
        var verb       = new VerbConstr(parent);
        verb.raw       = raw;
        verb.content   = inner;
        token          = _U.newToken(tp);
        tokens[token]  = verb;
      }
      return pre + token;
    };
    do {
      txt = txt.replace(verbRgxp, replaceFn);
    } while (verbRgxp.exec(txt));
    return txt;
  }
});

var Code = verbTypes['='] = Inline.define({
  parent: Verbatim,
  type: 'code'
});

Verbatim.types = verbTypes;

module.exports = exports = Verbatim;
},{"../inline":10,"../utils":4}],41:[function(require,module,exports){
var _U     = require('../utils');
var Inline = require('../inline');

var Sub = Inline.define({
  type: 'sub',
  attrs: {
    rgxp: /(\S)_(?:(\*|[+-]?\w+)|\{([^\}]*)\})/g
  },
  replace: function (txt, parent, tp, tokens) {
    var Constr = this;
    return txt.replace(this.rgxp, function () {
      var a       = arguments;
      this.raw    = a[0].substr(1);
      var content = a[3] || a[2];

      var inline = new Constr(parent);
      inline.define(content);

      var token = _U.newToken(tp);
      tokens[token] = inline;
      return a[1] + token;
    });
  },
  methods: {
    define: function (content) {
      this.content = this.parseInline(content);
    }
  }
});

module.exports = exports = Sub;
},{"../inline":10,"../utils":4}],8:[function(require,module,exports){
var _U       = require('../utils');
var _        = _U._;
var JSONPath = _U.dependency('JSONPath', 'jsonPath');
var TreeNode = require('../tree');

var RenderEngine = function (obj) {
  obj = obj || {};
  var defaults = obj.defaults || {};
  this.matchers = _.defaults(defaults, obj.matchers);
};

var empty = function () { return ''; };

RenderEngine.prototype = {
  getRenderer: function (node) {
    var renderFn = this.matchers[node.type] || empty;
    return _.bind(renderFn, node);
  },
  render: function (doc) {
    var engine = this;
    var render = function renderCb (node) {
      if (node === null || node === void 0) {
        _U.log.error('Ignoring render for wrong value', node);
        return '';
      }
      else if (_.isArray(node)) {
        return _U.join.apply(engine, _.map(node, render));
      } else if (node.isTreeNode) {
        return engine.getRenderer(node)(render, node);
      } else {
        _U.log.info('Rendering non-treenode object', '' + node);
        return '' + node;
      }
    };

    return engine.getRenderer(doc)(render, doc);
  }
};

module.exports = exports = RenderEngine;

},{"../utils":4,"../tree":5}],20:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Quote = Block.define({
  parent: BeginEnd,
  type: 'quote',
  methods: {
    finalize: function () {
      var lines = this.lines.asArray();
      var lastLine = lines.pop();
      var m = lastLine && (lastLine.match(/^\s*--\s+(.*)\s*$/));
      if(m) {
        this.signature = this.parseInline(m[1]);
      } else {
        lines.push(lastLine);
      }
      this.content = this.parseInline(lines.join('\n'));
    }
  }
});

module.exports = exports = Quote;
},{"../../block":3,"./beginend":50}],19:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Example = Block.define({
  parent: BeginEnd,
  type: 'example',
  methods: {}
});

module.exports = exports = Example;
},{"../../block":3,"./beginend":50}],28:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Comment = Block.define({
  parent: BeginEnd,
  type: 'comment',
  methods: {}
});

module.exports = exports = Comment;
},{"../../block":3,"./beginend":50}],31:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Src = Block.define({
  parent: BeginEnd,
  type: 'src',
  methods: {
    params: function (line) {
      var match = /^\s*#\+begin_src\s+([a-z\-]+)(?:\s|$)/i.exec(line);
      this.language = match ? match[1] : null;
      // TODO: deal with switches (see org doc 11.3)
    }
  }
});

module.exports = exports = Src;
},{"../../block":3,"./beginend":50}],22:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Verse = Block.define({
  parent: BeginEnd,
  type: 'verse',
  methods: {
    params: function (line) {
      this.indent = /^(\s*)/.exec(line || '')[1].length;
    },
    finalize: function () {
      var lines = this.lines.asArray();
      var lastLine = lines.pop();
      var m = lastLine && (lastLine.match(/^\s*--\s+(.*)\s*$/));
      if(m) {
        this.signature = this.parseInline(m[1]);
      } else {
        lines.push(lastLine);
      }
      var i = this.indent;
      var rgxp = new RegExp('^ {' + this.indent + '}');
      lines = _.map(lines, function (l) { return l.replace(rgxp, ''); });
      this.content = this.parseInline(lines.join('\n'));
    }

  }
});

module.exports = exports = Verse;
},{"../../block":3,"./beginend":50}],21:[function(require,module,exports){
var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Center = Block.define({
  parent: BeginEnd,
  type: 'center',
  methods: {}
});

module.exports = exports = Center;
},{"../../block":3,"./beginend":50}],51:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');

var Item = Block.define({
  parent: Block,
  type: '_item',
  methods: {
    accepts: function (lines) {
      return _U.indentLevel(lines.peak()) >= this.indent;
    },
    consume: function (lines) {
      var next;
      this.prepare(lines);
      do {
        next = new (Block.get(lines))(this);
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Item;
},{"../../utils":4,"../../block":3}],27:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var OlItem = require('./olitem');

var olRgxp = /^(\s*)\d+[\.)]\s/;

var Olist = List.define({
  itemType: OlItem,
  type: 'ol',
  match: function (lines, parent) {
    var line = lines.peakOverProperties();
    return line.match(olRgxp);
  },
  methods: {
    prepare: function (lines) { this.count = 0; },
    consume: function (lines) {
      var props = lines.properties();
      this.setProperties(props);

      this.indent = _U.indentLevel(lines.peak());
      this.prepare(lines);
      do {
        var item = new OlItem(this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Olist;
},{"../../utils":4,"./_list":52,"../../block":3,"./olitem":32}],32:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item') ;

var olitemRgxp = /^(\s*)\d+[\.)]\s/;

var OlItem = Block.define({
  parent: Item,
  type: 'olitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(olitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 3;
      // Remove the list marker
      line = line.replace(olitemRgxp, '$1   ');
      // Remove the item number if present
      var num = _U.ensure(line.match(/^\s*\[@(\d+)\]\s/), [])[1];
      if (num) {
        this.num = parseInt(num, 10);
        this.parent.properties.start = this.num;
        line = line.replace(/^(\s*)\[@(\d+)\]\s/, '$1');
      } else {
        this.num = ++(this.parent.count);
      }
      // Parse and remove the checkbox if present
      var chkbox = _U.ensure(line.match(/^\s*\[([ X-])\]\s/), [])[1];
      if (chkbox) {
        this.properties.checkbox = chkbox;
        line = line.replace(/^(\s*)\[[ X-]\]\s/, '$1');
      }
      // Push the modified line to parse the list item content
      lines.push(line);
    }
  }
});


module.exports = exports = OlItem;
},{"../../utils":4,"../../block":3,"./_item":51}],25:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var UlItem = require('./ulitem');

var Ulist = List.define({
  itemType: UlItem,
  type: 'ul',
  methods: {
    prepare: function (lines) {}
  }
});

module.exports = exports = Ulist;
},{"../../utils":4,"../../block":3,"./_list":52,"./ulitem":26}],26:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item');

var ulitemRgxp = /^\s*[\+\*-]\s/;

var UlItem = Block.define({
  parent: Item,
  type: 'ulitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(ulitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 2;
      // Remove the list marker
      line = line.replace(/^(\s*)[+*-]\s/, '$1  ');
      // Parse and remove the checkbox if present
      var chkbox = _U.ensure(line.match(/^\s*\[([ X-])\]\s/), [])[1];
      if (chkbox) {
        this.properties.checkbox = chkbox;
        line = line.replace(/^(\s*)\[[ X-]\]\s/, '$1');
      }
      // Push the modified line to parse the list item content
      lines.push(line);
    }
  }
});

module.exports = exports = UlItem;
},{"../../block":3,"../../utils":4,"./_item":51}],50:[function(require,module,exports){
var _U    = require('../../utils');
var _     = _U._;
var Block = require('../../block');

var BeginEnd = (function () { 

  var makeRgxp = (function () {
    var memoResolver = function () { return _U.array(arguments).join(' '); };
    var result = function (be, type) {
      return new RegExp('^\\s*#\\+' + be + '_' + type, 'i');
    };
    return _.memoize(result, memoResolver);
  }());

  return Block.define({
    parent: Block,
    type: 'beginend',
    match: function (lines, parent) {
      var beginRgxp = makeRgxp('begin', this.type);
      return _U.ensure(_U.peak(lines), '').match(beginRgxp);
    },
    methods: {
      accepts: function (lines) { return false; },
      params: function (line) {},
      consume: function (lines) {
        this.params(lines.pop());
        var endRgxp = makeRgxp('end', this.type);
        this.lines = lines.popUntil(endRgxp);
        this.content = this.lines.asArray().join('\n');
        lines.pop(); // Remove the end line
        lines.trimBlank();
        this.finalize();
      },
      finalize: function () {}
    }
  });

}());

module.exports = exports = BeginEnd;
},{"../../utils":4,"../../block":3}],24:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var DlItem = require('./dlitem');

var Dlist = List.define({
  itemType: DlItem,
  type: 'dl',
  methods: {
    prepare: function (lines) {}
  }
});

module.exports = exports = Dlist;
},{"./_list":52,"../../block":3,"../../utils":4,"./dlitem":23}],37:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var propRgxp = _U.rgxp.propLine;

var PropDef = Block.define({
  type: 'propdef',
  match: function (lines, parent) {
    var line = (_U.peak(lines) || '');
    return !!line.match(propRgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
      var m = line.match(propRgxp);
      var key = m[1];
      var value = m[2];
      var section = this.section();
      if (section.properties[key]) {
        section.properties[key] = section.properties[key] + '\n' + value;
      } else {
        section.properties[key] = value;
      }
    }
  }
});

module.exports = exports = PropDef;
},{"../../utils":4,"../../block":3}],13:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*CLOCK: \[(\d{4}-\d\d-\d\d) [A-Za-z]{3}\.? (\d\d:\d\d)\](?:--\[(\d{4}-\d\d-\d\d) [A-Za-z]{3}\.? (\d\d:\d\d)\] =>\s*(-?\d+:\d\d))?\s*$/g;

var Clockline = Block.define({
  type: 'clockline',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
    }
  }
});

module.exports = exports = Clockline;
},{"../../block":3,"../../utils":4}],52:[function(require,module,exports){
var _U    = require('../../utils');
var _     = _U._;
var Block = require('../../block');

var List = {};

List.define = function (obj) {

  var ItemType = obj.itemType;

  var methods = _.defaults(obj.methods, {
    accepts: function (lines) {
      return ItemType.match(lines) && _U.indentLevel(lines.peak()) === this.indent;
    },
    consume: function (lines) {
      this.indent = _U.indentLevel(lines.peak());
      this.prepare(lines);
      do {
        var item = new ItemType(this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  });

  var result = Block.define({
    parent       : Block,
    type         : obj.type,
    match        : obj.match || ItemType.match,
    methods      : methods
  });

  return result;
};

module.exports = exports = List;
},{"../../utils":4,"../../block":3}],15:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*SCHEDULED: <(\d{4}-\d\d-\d\d) [A-Za-z]{3}>\s*$/g;

var Scheduled = Block.define({
  type: 'scheduled',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
    }
  }
});

module.exports = exports = Scheduled;
},{"../../utils":4,"../../block":3}],23:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item') ;

var dlitemRgxp = /^(\s*)[\+\*-]\s+(.*?)\s*::\s*/;

var DlItem = Block.define({
  parent: Item,
  type: 'dlitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(dlitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 2;
      // Get the tag name
      var m = line.match(dlitemRgxp);
      this.tag = this.parseInline(m[2]);
      // Remove the list marker
      line = line.replace(dlitemRgxp, '$1  ');
      // Push the modified line to parse the list item content
      if (_U.notBlank(line)) { lines.push(line); }
    }
  }
});

module.exports = exports = DlItem;
},{"../../utils":4,"../../block":3,"./_item":51}],33:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var CommentLine = Block.define({
  parent: Block,
  type: "commentline",
  match: function (lines, parent) {
    return (_U.peak(lines) || '').match(/^\s*#\s/);
  },
  methods: {
    accepts: function (lines) {},
    consume: function (lines) {
      this.raw = lines.pop();
    }
  }
});

module.exports = exports = CommentLine;
},{"../../utils":4,"../../block":3}],29:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');

var startRgxp = /^\s*:(\w+):\s*$/i;
var endRgxp = /^\s*:END:\s*$/i;

var Drawer = Block.define({
  parent: Block,
  type: 'drawer',
  match: function (lines) {
    return (_U.peak(lines) || '').match(startRgxp);
  },
  methods: {
    treat: function (lines) {
      this.content = lines.asArray().join('\n');
    },
    consume: function (lines) {
      var line = lines.pop();
      this.name = line.match(startRgxp)[1];
      var contentLines = lines.popUntil(endRgxp);
      this.treat(contentLines);
      lines.pop();
      lines.trimBlank();
    }
  }
});

module.exports = exports = Drawer;
},{"../../utils":4,"../../block":3}],18:[function(require,module,exports){
var _U    = require('../../utils');
var Block = require('../../block');

var fndefRgxp = /^(\s*)\[(\d+|fn:.+?)\]\s*/;

var FnDef = Block.define({
  parent: Block,
  type: 'fndef',
  match: function (lines, parent) {
    return (_U.peak(lines) || "").match(fndefRgxp);
  },
  methods: {
    accepts: function (lines) {
      var line = lines.peak();
      var indent = _U.indentLevel(line);
      return indent >= this.indent;
    },
    prepare: function (lines) {
      var line = lines.pop();
      // Register the footnote in the current document.
      var m = line.match(fndefRgxp);
      this.name = m[2].replace(/^fn:/, '');
      this.document().declareFootnote(this);
      // Remove the footnote declaration to allow sub-nodes parsing.
      line = line.replace(fndefRgxp, '$1');
      lines.push(line);
    },
    consume: function (lines) {
      var line = lines.peak();
      this.indent = _U.indentLevel(line);
      this.prepare(lines);
      var linebreak = 0;
      do {
        var next = new (Block.get(lines))(this);
        this.append(next);
        next.consume(lines);
        linebreak = (lines.length() === 0) || lines.trimBlank().length() > 0;
      } while (linebreak === 0 && this.accepts(lines));
    }
  }
});

module.exports = exports = FnDef;
},{"../../utils":4,"../../block":3}],14:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*DEADLINE: <(\d{4}-\d\d-\d\d) [A-Z]{3}>\s*$/ig;

var Deadline = Block.define({
  type: 'deadline',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
    }
  }
});

module.exports = exports = Deadline;
},{"../../utils":4,"../../block":3}],17:[function(require,module,exports){
var _U      = require('../../utils');
var Block   = require('../../block');

var Hr = Block.define({
  parent: Block,
  type: 'hr',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines), '').match(/^\s*-{5,}\s*$/);
  },
  methods: {
    accepts: function (lines) {},
    consume: function (lines) {
      this.raw = lines.pop();
    }
  }
});

module.exports = exports = Hr;
},{"../../utils":4,"../../block":3}],9:[function(require,module,exports){
var _U = require('../../utils');
var j  = _U.join;

var silent = function () {return '';};

var raw = function () { return this.raw; };

var tag = function (name, content) {
  return j('<', name, '>', content, '</', name, '>'); 
};

var tagchildren = function (t) { 
  return function (r) { 
    return tag(t, r(this.children())); 
  };
};

var tagcontent = function (t) { 
  return function (r) { 
    return tag(t, r(this.content)); 
  };
};

var defaultHtmlMatchers = {
  document: function (r, doc) {
    var result = [];
    var title = doc.properties.title;
    if (title) {
      result.push(tag('h1', j(r(doc.parseInline(title)))));
    }
    result.push(tag('article', j(r(doc.content), r(doc.children()))));

    if (doc.footnotes.length > 0) {
      result.push('<hr/>');
      _.each(doc.footnotes, function (fndef) {
        var n = fndef.number;
        var content = r(fndef.children());
        var fnHtml = j(
          '<a name="fn-', n, '"></a>',
          '<table class=""fn><tr><td>',
          '<sup><a href="#fnref-', n, '">', n, '</a></sup> ', 
          '</td><td>',
          content,
          '</td></tr></table>'
        );
        result.push(fnHtml);
      });
    }

    return result.join('');
  },
  section: function (r) {
    return tag('section',
      j(r(this.headline), 
        r(this.content), 
        r(this.children())));
  },
  headline: function (r) {
    return tag('h' + this.level, r(this.title));
  },
  content: tagchildren('div'),

  // Blocks
  para: tagchildren('p'),
  hr: function (r) { return '<hr/>'; },
  illust: function (r) {
    var s = '';
    if (this.properties.caption) { 
      s = tag('figcaption', r(this.parseInline(this.properties.caption))); 
    }
    return j(
      '<figure class="illust">',
      '<img src="', this.url, '"/>',
      s,
      '</figure>'
    );
  },

  // List blocks
  ul: tagchildren('ul'),
  ulitem: tagchildren('li'),
  ol: function (r) {
    var start = this.properties.start || 1;
    var type = this.properties.type || '1';
    return j(
      '<ol start="', start, '" type="', type, '">', 
      r(this.children()), 
      '</ol>'
    );
  },
  olitem: tagchildren('li'),
  dl: tagchildren('dl'),
  dlitem: function (r) {
    return j('<dt>', r(this.tag), '</dt><dd>', r(this.children()), '</dd>');
  },

  // Drawers
  drawer: function (r) { return ''; },

  // Begin-end blocks
  verse: function (r) {
    var s = '';
    if (this.signature) { 
      s = tag('figcaption', r(this.signature)); 
    }
    return j(
      '<figure class="verse">', 
      tag('pre', r(this.content)), 
      s, 
      '</figure>'
    );
  },
  src: tagcontent('pre'),
  quote: function (r) {
    var s = '';
    if (this.signature) { 
      s = tag('figcaption', r(this.signature)); 
    }
    return j(
      '<figure class="quote">', 
      tag('blockquote', r(this.content)), 
      s, 
      '</figure>'
    );
  },
  example: tagcontent('pre'),
  center: tagcontent('center'),

  // Inline
  regular: function (r) {return this.content;},
  emphasis: tagchildren('em'),
  strong: tagchildren('strong'),
  underline: tagchildren('u'),
  strike: tagchildren('s'),
  sub: tagcontent('sub'),
  sup: tagcontent('sup'),

  entity: function (r) { return this.content.html; },
  linebreak: function (r) { return '<br/>'; },
  fnref: function (r, fnref) {
    var n;
    try { n = this.document().footnoteByName(fnref.name).number; }
    catch(e) { 
      _U.log.error('No footnote defined with name ' + fnref.name); 
      return ''; 
    }
    return j(
      '<a name="fnref-', n, '"></a>',
      '<sup><a href="#fn-', n, '">', n, '</a></sup>'
    );
  },

  latex: tagcontent('code'),
  verbatim: tagcontent('tt'),
  code: tagcontent('code'),

  link: function (r) {
    return j('<a href="', this.target, '">', this.desc || this.target, '</a>');
  }
};

module.exports = exports = defaultHtmlMatchers;
},{"../../utils":4}],53:[function(require,module,exports){
(function() {
  var Block, Config, Org, _, _U;

  require('jasmine-matchers');

  _U = require('../src/utils');

  _ = _U._;

  Org = require('../src/core');

  Config = require('../src/config');

  Block = require('../src/block');

  describe('Block', function() {
    return it('should be defined', function() {
      expect(Block).toBeDefined;
      return expect(Block).not.toBeNull;
    });
  });

}).call(this);


},{"../src/core":7,"../src/config":6,"../src/utils":4,"../src/block":3,"jasmine-matchers":54}],55:[function(require,module,exports){
(function() {
  var Config;

  require('jasmine-matchers');

  Config = require('../src/config');

  describe('Config', function() {
    return it('should be defined', function() {
      expect(Config).toBeDefined();
      return expect(Config).not.toBeNull();
    });
  });

  describe('Config.prepare', function() {
    return it('should define correct values', function() {
      var init, obj;

      init = {
        tabSize: 2,
        headlineTodos: ['TODO', 'DONE', 'WAIT']
      };
      obj = Config.prepare(init);
      expect(obj).toBeDefined();
      expect(obj).not.toBeNull();
      expect(obj.tabSize).toBe(init.tabSize);
      expect(obj.headlineTodos).toBe(init.headlineTodos);
      expect(obj.headlinePriorities).toBe(Config.defaults.headlinePriorities);
      expect(obj.get).toBeOfType('function');
      return expect(obj.get('tabSize')).toBe(init.tabSize);
    });
  });

}).call(this);


},{"../src/config":6,"jasmine-matchers":54}],56:[function(require,module,exports){
(function() {
  var _U;

  require('jasmine-matchers');

  _U = require('../src/utils');

  describe('Utils', function() {
    return it('should be defined', function() {
      expect(_U).toBeDefined();
      return expect(_U).not.toBeNull();
    });
  });

  describe('Utils.id', function() {
    it('should return two different values on two different calls', function() {
      return expect(_U.id()).not.toBe(_U.id());
    });
    return it('should return two values differing by 1', function() {
      var id1, id2;

      id1 = _U.id();
      id2 = _U.id();
      return expect(id2 - id1).toBe(1);
    });
  });

  describe('Utils.extendProto', function() {
    var Child, Parent;

    Parent = {};
    Child = {};
    beforeEach(function() {
      Parent = function() {};
      Parent.prototype = {
        name: function() {
          return 'parent';
        }
      };
      return Child = function() {
        return Parent.call(this);
      };
    });
    it('should add function to the prototype', function() {
      var c;

      _U.extendProto(Child, Parent, {
        type: function() {
          return 'child';
        }
      });
      c = new Child;
      expect(c.name()).toEqual('parent');
      return expect(c.type()).toEqual('child');
    });
    it('should overload function of the parent prototype', function() {
      var c;

      _U.extendProto(Child, Parent, {
        name: function() {
          return 'child';
        }
      });
      c = new Child;
      return expect(c.name()).toEqual('child');
    });
    return it('should return the new prototype', function() {
      var actual;

      actual = _U.extendProto(Child, Parent, {
        name: function() {
          return 'child';
        }
      });
      return expect(actual).toBe(Child.prototype);
    });
  });

}).call(this);


},{"../src/utils":4,"jasmine-matchers":54}],57:[function(require,module,exports){
(function() {
  var TreeNode, ids, _, _U;

  require('jasmine-matchers');

  _U = require('../src/utils');

  _U.id = _U.incrementor();

  _ = _U._;

  ids = function(arr) {
    return _.pluck(arr, 'id');
  };

  TreeNode = require('../src/tree');

  describe('TreeNode', function() {
    var n1, n2, n21, n22, n23, n24, n25, root;

    it('should be defined', function() {
      expect(TreeNode).not.toBeUndefined();
      return expect(TreeNode).not.toBeNull();
    });
    root = new TreeNode();
    n1 = new TreeNode(root);
    n2 = new TreeNode(root);
    n21 = new TreeNode(n2);
    n2.append(n21);
    n22 = new TreeNode(n2);
    n2.append(n22);
    n23 = new TreeNode(n2);
    n2.append(n23);
    n24 = new TreeNode(n2);
    n2.append(n24);
    n25 = new TreeNode(n2);
    n2.append(n25);
    describe('TreeNode.ancestors', function() {
      return it('should provide ancestors in document order', function() {
        return expect(ids(n22.ancestors())).toHavePropertiesWithValues([3, 1]);
      });
    });
    describe('TreeNode.children', function() {
      return it('should provide all children in document order', function() {
        return expect(ids(n2.children())).toHavePropertiesWithValues([4, 5, 6, 7, 8]);
      });
    });
    describe('TreeNode.prevAll', function() {
      return it('should provide all previous siblings in document order', function() {
        return expect(ids(n22.ancestors())).toHavePropertiesWithValues([3, 1]);
      });
    });
    describe('TreeNode.prev', function() {
      return it('should provide only the previous sibling', function() {
        return expect(n23.prev().id).toBe(5);
      });
    });
    describe('TreeNode.nextAll', function() {
      return it('should provide all next siblings in document order', function() {
        return expect(ids(n23.nextAll())).toHavePropertiesWithValues([7, 8]);
      });
    });
    describe('TreeNode.next', function() {
      return it('should provide only the next sibling', function() {
        return expect(n23.next().id).toBe(7);
      });
    });
    describe('TreeNode.siblingsAll', function() {
      return it('should provide all siblings in document order, with the current node', function() {
        return expect(ids(n23.siblingsAll())).toHavePropertiesWithValues([4, 5, 6, 7, 8]);
      });
    });
    return describe('TreeNode.siblings', function() {
      return it('should provide all siblings in document order, except for the current node', function() {
        return expect(ids(n23.siblings())).toHavePropertiesWithValues([4, 5, 7, 8]);
      });
    });
  });

}).call(this);


},{"../src/tree":5,"../src/utils":4,"jasmine-matchers":54}],58:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],54:[function(require,module,exports){
(function(process){var matcherFiles = [
  'toBe.js',
  'toContain.js',
  'toHave.js',
  'toStartEndWith.js',
  'toThrow.js'
];

var i, l;

if (typeof process !== 'undefined' && typeof process.nextTick !== 'undefined') {
  // node.js
  for(i=0, l=matcherFiles.length; i<l; i++) {
    require('./' + matcherFiles[i]);
  }
} else {
  // fallback
  console.warn('[jasmine-matchers] Since v0.2.0 please import each matcher-file separately: ' + matcherFiles.join(', '));
}

})(require("__browserify_process"))
},{"__browserify_process":58}],59:[function(require,module,exports){
(function() {
  var Lines, txt1, txt2;

  require('jasmine-matchers');

  Lines = require('../../src/block/lines');

  txt1 = "This is a sample text.\nWith only two lines.";

  txt2 = "  \n  \nThis is a sample text.\nWith initially two blank lines (second one has 2 spaces).";

  describe('Lines', function() {
    return it('should have an arr Array property', function() {
      var l;

      l = new Lines(txt1);
      expect(l.array).toBeArray;
      return expect(l.arr.length).toBe(2);
    });
  });

  describe('Lines.length', function() {
    return it('should return the length or remaining lines', function() {
      var l;

      l = new Lines(txt1);
      expect(l.length()).toBe(2);
      l.pop();
      return expect(l.length()).toBe(1);
    });
  });

  describe('Lines.popWhile', function() {
    it('should return an array', function() {
      var l, popped;

      l = new Lines(txt1);
      popped = l.popWhile(/.*/);
      return expect(popped.arr).toBeArray;
    });
    it('should return all lines if passed a function always returning true', function() {
      var l, popped;

      l = new Lines(txt1);
      popped = l.popWhile(function() {
        return true;
      });
      expect(popped.arr.length).toBe(2);
      return expect(l.length()).toBe(0);
    });
    it('should return all lines if passed a regexp matching anything', function() {
      var l, popped;

      l = new Lines(txt1);
      popped = l.popWhile(/.*/g);
      expect(popped.arr.length).toBe(2);
      return expect(l.length()).toBe(0);
    });
    return it('should work with regexps', function() {
      var l, popped;

      l = new Lines("a\na\na\nb");
      popped = l.popWhile(/^a$/g);
      expect(popped.arr.length).toBe(3);
      return expect(l.length()).toBe(1);
    });
  });

  describe('Lines.trimBlank', function() {
    it('should do nothing if nothing to be removed', function() {
      var l, lengthBefore, trimmed;

      l = new Lines(txt1);
      lengthBefore = l.length;
      trimmed = l.trimBlank();
      return expect(trimmed.length()).toBe(0);
    });
    return it('should remove all blank lines from the current array', function() {
      var l, trimmed;

      l = new Lines(txt2);
      expect(l.length()).toBe(4);
      trimmed = l.trimBlank();
      expect(trimmed.length()).toBe(2);
      expect(l.length()).toBe(2);
      return expect(l.pop()).toEqual('This is a sample text.');
    });
  });

}).call(this);


},{"../../src/block/lines":47,"jasmine-matchers":54}],60:[function(require,module,exports){
(function() {
  var Config, Headline;

  require('jasmine-matchers');

  Config = require('../../src/config');

  Headline = require('../../src/block/headline');

  describe('Headline', function() {
    return it('should be defined', function() {
      expect(Headline).toBeDefined();
      return expect(Headline).not.toBeNull();
    });
  });

  describe('Headline.parser', function() {
    var parser;

    parser = Headline.parser(Config.defaults);
    it('should provide a function', function() {
      return expect(parser).toBeOfType('function');
    });
    it('should parse a simple headline', function() {
      var hl, line;

      line = '** Simple headline';
      hl = parser(line);
      expect(hl.stars).toBe('**');
      expect(hl.level).toBe(2);
      expect(hl.todo).toBeNull;
      expect(hl.priority).toBeNull;
      return expect(hl.tags).toBeEmpty;
    });
    it('should parse a headline with TODO marker', function() {
      var hl, line;

      line = '** TODO Simple headline';
      hl = parser(line);
      return expect(hl.todo).toBe('TODO');
    });
    it('should parse a headline with priority marker', function() {
      var hl, line;

      line = '** TODO [#B] Simple headline';
      hl = parser(line);
      return expect(hl.priority).toBe('B');
    });
    return it('should parse a headline with some tags', function() {
      var hl, line;

      line = '** TODO [#B] Simple headline    :some:tags:';
      hl = parser(line);
      expect(hl.tags.length).toBe(2);
      expect(hl.tags[0]).toBe('some');
      return expect(hl.tags[1]).toBe('tags');
    });
  });

}).call(this);


},{"../../src/config":6,"../../src/block/headline":11,"jasmine-matchers":54}],61:[function(require,module,exports){
(function() {
  var Emphasis, Inline;

  require('jasmine-matchers');

  Inline = require('../../src/inline');

  Emphasis = require('../../src/inline/emphasis');

  describe('Emphasis', function() {
    return describe('Emphasis.replace', function() {
      var parent, tokens;

      parent = 0;
      tokens = 0;
      beforeEach(function() {
        parent = new Inline();
        return tokens = {};
      });
      it('should treat correctly an emphasis starting the text', function() {
        var txt, txtInit;

        txtInit = "/Starting/ the text.";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?; the text./);
      });
      it('should treat correctly an emphasis ending the text', function() {
        var txt, txtInit;

        txtInit = "Ending the /text./";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Ending the TKN:[^;]+?;/);
      });
      it('should treat correctly two emphasis in the same text', function() {
        var txt, txtInit;

        txtInit = "Then /starting/ the text. Ending the /text./";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Then TKN:[^;]+?; the text. Ending the TKN:[^;]+?;/);
      });
      it('should treat correctly two emphasis nested in the same text', function() {
        var txt, txtInit;

        txtInit = "Some /emphasis /nested/ in the/ text.";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Some TKN:[^;]+?; text./);
      });
      it('should treat correctly an emphasis containing its own escaped trigger character', function() {
        var txt, txtInit;

        txtInit = "Some /em\\/is/ text.";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Some TKN:[^;]+?; text./);
      });
      it('should treat correctly an emphasis containing only one character', function() {
        var txt, txtInit;

        txtInit = "Some /1/ text.";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Some TKN:[^;]+?; text./);
      });
      return it('should treat correctly an emphasis with new line in it', function() {
        var txt, txtInit;

        txtInit = "Some /new\nline/ text.";
        txt = Emphasis.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Some TKN:[^;]+?; text./);
      });
    });
  });

}).call(this);


},{"../../src/inline":10,"../../src/inline/emphasis":43,"jasmine-matchers":54}],62:[function(require,module,exports){
(function() {
  var Entity, Inline;

  require('jasmine-matchers');

  Inline = require('../../src/inline');

  Entity = require('../../src/inline/entity');

  describe('Entity', function() {
    return describe('Entity.replace', function() {
      var parent, tokens;

      parent = 0;
      tokens = 0;
      beforeEach(function() {
        parent = new Inline();
        return tokens = {};
      });
      return it('should treat correctly an entity in the text', function() {
        var txt, txtInit;

        txtInit = "Starting \\alpha; the text.";
        txt = Entity.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/Starting TKN:[^;]+?;; the text./);
      });
    });
  });

}).call(this);


},{"../../src/inline/entity":39,"../../src/inline":10,"jasmine-matchers":54}],63:[function(require,module,exports){
(function() {
  var Inline, Link;

  require('jasmine-matchers');

  Inline = require('../../src/inline');

  Link = require('../../src/inline/link');

  describe('Link', function() {
    return describe('Link.replace', function() {
      var parent, tokens;

      parent = 0;
      tokens = 0;
      beforeEach(function() {
        parent = new Inline();
        return tokens = {};
      });
      it('should treat correctly a bare link starting the text', function() {
        var txt, txtInit;

        txtInit = "http://hegemonikon.org#test starting the text.";
        txt = Link.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?; starting the text./);
      });
      it('should treat correctly a simple link starting the text', function() {
        var txt, txtInit;

        txtInit = "[[http://hegemonikon.org#test]] starting the text.";
        txt = Link.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?; starting the text./);
      });
      it('should treat correctly a full link starting the text', function() {
        var txt, txtInit;

        txtInit = "[[http://hegemonikon.org#test][The *hegemonikon* website]] starting the text.";
        txt = Link.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?; starting the text./);
      });
      return it('should treat correctly two links in the same text', function() {
        var txt, txtInit;

        txtInit = "[[http://hegemonikon.org]] should be the same as http://hegemonikon.org/";
        txt = Link.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?; should be the same as TKN:[^;]+?;/);
      });
    });
  });

}).call(this);


},{"../../src/inline/link":34,"../../src/inline":10,"jasmine-matchers":54}],64:[function(require,module,exports){
(function() {
  var Block, Lines, Org, Section;

  require('jasmine-matchers');

  Org = require('../../src/core');

  Block = require('../../src/block');

  Section = require('../../src/block/section');

  Lines = require('../../src/block/lines');

  describe('Section.match', function() {
    it('should return true for a line starting with a star', function() {
      return expect(Section.match(new Lines('* anything'))).toEqual(true);
    });
    return it('should return false for anything else', function() {
      expect(Section.match(new Lines('\t* anyting'))).toEqual(false);
      expect(Section.match(new Lines('anything'))).toEqual(false);
      return expect(Section.match(new Lines(''))).toEqual(false);
    });
  });

  describe('Section.consume', function() {
    var doc, txt;

    txt = "Introduction\n* Main title\n** Sub1\n   Some para\n   continued TKN here\n\n   Another para\n** Sub2\n* Conclusion\n  The end";
    doc = new Section();
    doc.org = new Org;
    doc.consume(new Lines(txt));
    return it('should parse the correct structure', function() {
      var conclusion, main, sub1, sub2;

      expect(doc.children().length).toBe(2);
      main = doc.children()[0];
      expect(main.headline).toBeUndefined;
      conclusion = doc.children()[1];
      expect(main.children().length).toBe(2);
      sub1 = main.children()[0];
      sub2 = main.children()[0];
      expect(sub1.headline).not.toBeUndefined;
      expect(sub1.children().length).toBe(0);
      expect(sub2.headline).not.toBeUndefined;
      expect(sub2.children().length).toBe(0);
      expect(conclusion.children().length).toBe(0);
      return expect(conclusion.headline).not.toBeUndefined;
    });
  });

}).call(this);


},{"../../src/core":7,"../../src/block":3,"../../src/block/section":30,"../../src/block/lines":47,"jasmine-matchers":54}],65:[function(require,module,exports){
(function() {
  var Inline, Regular;

  require('jasmine-matchers');

  Inline = require('../../src/inline');

  Regular = require('../../src/inline/regular');

  describe('Regular', function() {
    return describe('Regular.replace', function() {
      it('should treat correctly a regular starting the text', function() {
        var parent, tokens, txt, txtInit;

        txtInit = "Regular TKN:1;";
        parent = new Inline();
        tokens = {
          'TKN:1;': {}
        };
        txt = Regular.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:[^;]+?;TKN:1;/);
      });
      it('should treat correctly a regular ending the text', function() {
        var parent, tokens, txt, txtInit;

        txtInit = "TKN:1; regular.";
        parent = new Inline();
        tokens = {
          'TKN:1;': {}
        };
        txt = Regular.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:1;TKN:[^;]+?;/);
      });
      return it('should treat correctly two regulars around tokens', function() {
        var parent, tokens, txt, txtInit;

        txtInit = "TKN:1; regular TKN:1;";
        parent = new Inline();
        tokens = {
          'TKN:1;': {}
        };
        txt = Regular.replace(txtInit, parent, 'TKN', tokens);
        return expect(txt).toMatch(/TKN:1;TKN:[^;]+?;TKN:1;/);
      });
    });
  });

}).call(this);


},{"../../src/inline":10,"../../src/inline/regular":45,"jasmine-matchers":54}],66:[function(require,module,exports){
(function() {
  var RenderEngine;

  require('jasmine-matchers');

  RenderEngine = require('../../src/render/engine');

  describe('RenderEngine', function() {
    return it('should be defined', function() {
      return expect(RenderEngine).not.toBeUndefined;
    });
  });

}).call(this);


},{"../../src/render/engine":8,"jasmine-matchers":54}],67:[function(require,module,exports){
(function() {
  var Comment, Document;

  require('jasmine-matchers');

  Document = require('../../../src/document');

  Comment = require('../../../src/block/beginend/comment');

  describe('Comment', function() {
    return it('should work with a 2-line comment', function() {
      var comment, doc, lines, txt;

      txt = "#+BEGIN_COMMENT\nthis is\na comment\n#+END_COMMENT";
      doc = (Document.parser())(txt);
      expect(doc.content.children().length).toBe(1);
      comment = doc.content.children()[0];
      expect(comment.type).toBe('comment');
      expect(comment.lines.length()).toBe(2);
      lines = comment.lines.asArray();
      expect(lines[0]).toBe('this is');
      return expect(lines[1]).toBe('a comment');
    });
  });

}).call(this);


},{"../../../src/document":12,"../../../src/block/beginend/comment":28,"jasmine-matchers":54}]},{},[3,28,20,19,31,1,22,49,11,21,16,47,51,27,32,25,26,50,36,23,52,24,37,15,13,33,29,30,18,14,6,17,7,12,46,10,43,40,39,35,44,34,45,41,42,9,38,8,5,4,53,59,67,2,60,48,61,62,55,63,64,65,66,56,57])
;