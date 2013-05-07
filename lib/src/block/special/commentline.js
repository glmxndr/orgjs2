var _U      = require('../../utils');
var Block   = require('../../block');

var CommentLine = Block.define({
  parent: Block,
  type: "commentline",
  registerLevel: "high",
  match: function (lines, parent) {
    try{
      return (_U.peak(lines) || '').match(/^\s*#\s/);
    } catch(e) {
      console.log(_U.peak(lines));
    }
  },
  methods: {
    accepts: function (lines) {},
    consume: function (lines) {
      this.raw = lines.pop();
    }
  }
});

module.exports = exports = CommentLine;