var _     = require('lodash');
var _U    = require('../../utils');
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
        var item = new ItemType(this.org, this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  });

  var result = Block.define({
    parent       : Block,
    type         : obj.type,
    registerLevel: obj.registerLevel,
    match        : ItemType.match,
    methods      : methods
  });

  return result;
};

module.exports = exports = List;