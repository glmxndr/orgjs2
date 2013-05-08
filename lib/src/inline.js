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
Inline.register = function (Constr, level) {
  if (prec[level]) {Inline.register(Constr, level + 1);}
  else { prec[level] = Constr; }
};

//------------------------------------------------------------------------------

Inline.define = function (obj) {
  var Parent = obj.parent || Inline;
  var Result = function () {
    Parent.apply(this, arguments);
    this.type = obj.type;
    if (this.init) { this.init.apply(this, arguments); }
  };
  Result.name = obj.type;
  Result.type = obj.type;
  Result.replace = obj.replace || Parent.replace || function () { return ""; };
  _U.extendProto(Result, Parent, obj.methods);
  if (obj.registerLevel) { Inline.register(Result, obj.registerLevel); }
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
    var rest = txt.replace(new RegExp(tp + ':\\d+;', 'g'), function (m) {
      parent.append(tokens[m]);
      return "";
    });
    return result;
  };
};

//------------------------------------------------------------------------------

module.exports = exports = Inline;