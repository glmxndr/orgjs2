var _U    = require('../../utils');
var Block = require('../../block');

var startRgxp = /^\s*:(\w+):\s*$/i;
var endRgxp = /^\s*:END:\s*$/i;

var Drawer = Block.define({
  parent: Block,
  type: 'drawer',
  match: function (lines) {
    return (_U.peak(lines) || '').match(startRgxp);
  },
  methods: {
    treat: function (lines) {
      this.content = lines.asArray().join('\n');
    },
    consume: function (lines) {
      var line = lines.pop();
      this.name = line.match(startRgxp)[1];
      var contentLines = lines.popUntil(endRgxp);
      this.treat(contentLines);
      lines.pop();
      lines.trimBlank();
    }
  }
});

module.exports = exports = Drawer;