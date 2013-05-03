var _U      = require('../utils');
var Block   = require('./block');

var CommentLine = Block.define({
  parent: Block,
  type: "commentline",
  registerLevel: "high",
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines), '').match(/^\s*#\s/);
  },
  methods: {
    accepts: function (lines) {},
    consume: function (lines) {
      this.raw = lines.pop();
      lines.trimBlank();
    }
  }
});

module.exports = exports = CommentLine;