var _U      = require('../utils');
var Block   = require('../block');

var Content = function (parent) {
  Block.call(this, parent);
  this.type = "content";
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