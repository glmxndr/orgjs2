var _        = require('lodash');
var _U       = require('./utils');
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

var lvls = Inline.levels = ['highest', 'high', 'medium', 'low', 'lowest'];
// Create an object associating each level key to an empty array
var prec = Inline.precedence = _.zipObject(lvls, _.map(lvls, function(){return [];}));

/**
 * Allows to register a new Block constructor at a given precedence level.
 * @param  {Block} Constr the block constructor
 * @param  {String} level  the level name, must be present in Block.levels
 */
Inline.register = function (Constr, level) {
  if (!_.isArray(prec[level])) { throw 'Unknown level : ' + level; }
  prec[level].push(Constr);
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
  _U.extendProto(Result, Parent, obj.methods);
  if (obj.registerLevel) { Inline.register(Result, obj.registerLevel); }
  return Result;
};

//------------------------------------------------------------------------------

Inline.parser = function (conf) {
  return function (lines, parent) {
    var raw = _.isString(lines) ? lines : new Lines(lines).asString();
    var txt = raw;

    var tokenPrefix = _U.absentToken(txt);
    var tokens = {};
    _.each(lvls, function(lvl){
      _.each(prec[lvl], function(Constr){ 
        txt = Constr.replace(txt, parent, tokenPrefix, tokens);
      });
    });

    var result = [];
    var rest = txt.replace(new RegExp(tokenPrefix + ":[0-9]+;"), function (m) {
      console.log("Inline parsing", m, tokens[m]);
      result.push(tokens[m]);
      return "";
    });
    console.log("Inline parsing", "Rest", "[" + rest + "]");
    return result;
  };
};

//------------------------------------------------------------------------------

module.exports = exports = Inline;