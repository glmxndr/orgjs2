var _        = require('lodash');
var _U       = require('./utils');
var TreeNode = require('./tree');

var Block = function (parent) {
  TreeNode.call(this, parent);
  this.properties = {};
};

_U.extendProto(Block, TreeNode, {
  init         : function () {},
  document     : function () { return this.root(); },
  parentIndent : function () {
    return (this.parent && this.parent.indent) ? this.parent.indent : 0;
  }
});

var lvls = Block.levels = ['highest', 'high', 'medium', 'low', 'lowest'];
// Create an object associating each level key to an empty array
var prec = Block.precedence = _.zipObject(lvls, _.map(lvls, function(){return [];}));

/**
 * Allows to register a new Block constructor at a given precedence level.
 * @param  {Block} Constr the block constructor
 * @param  {String} level  the level name, must be present in Block.levels
 */
Block.register = function (Constr, level) {
  if (!_.isArray(prec[level])) { throw 'Unknown level : ' + level; }
  prec[level].push(Constr);
};

/**
 * Get the Block constructor matching the given lines.
 * @param  {Array} lines the following lines
 * @return {Block}       the constructor
 */
Block.get = function (lines, parent) {
  var result;
  _.each(lvls, function(lvl){
    if (result) {return;}
    _.each(prec[lvl], function(Constr){
      if (Constr.match(lines, parent)) { result = Constr; }
    });
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
  if (obj.registerLevel) { Block.register(Result, obj.registerLevel); }
  return Result;
};

module.exports = exports = Block;