var _U      = require('../utils');
var Block   = require('./block');

var Content = function (org, parent) {
  Block.apply(this, arguments);
  this.type = "content";
};

_U.extendProto(Content, Block, {
  consume: function (lines) {
    lines.trimBlank();
    var next = 1;
    while (next && lines.length() > 0) {
      var next = new (Block.get(lines))(this.org, this);
      if (next) {
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      }
    }
  }
});

module.exports = exports = Content;