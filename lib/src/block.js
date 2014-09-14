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
    var doc = this.document();
    if (doc && doc.caption) {
      this.properties.caption      = doc.caption();
      this.properties.captionShort = doc.captionShort();
      this.properties.label        = doc.label();
    }
    if (this.init) { this.init.apply(this, arguments); }
  };
  Result.type = obj.type;
  Result.match = obj.match || Parent.match || function () { return false; };
  _U.extendProto(Result, Parent, obj.methods);
  return Result;
};

module.exports = exports = Block;