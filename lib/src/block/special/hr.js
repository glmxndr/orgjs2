var _U      = require('../../utils');
var Block   = require('../../block');

var Hr = Block.define({
  parent: Block,
  type: 'hr',
  registerLevel: 'high',
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