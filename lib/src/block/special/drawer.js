var _U    = require('../../utils');
var Block = require('../../block');

var startRgxp = /^\s*:(\w+):\s*$/i;
var endRgxp = /^\s*:END:\s*$/i;

var Drawers = Block.define({
  parent: Block,
  type: 'drawer',
  registerLevel: 'low',
  match: function (lines) {
    return _U.ensure(_U.peak(lines), '').match(startRgxp);
  },
  methods: {
    treat: function (lines) {
      this.content = lines.asArray();
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