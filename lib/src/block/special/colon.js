var _U      = require('../../utils');
var Block   = require('../../block');

var colonRgxp = /^\s*:(\s|$)/;

var Colon = Block.define({
  parent: Block,
  type: 'colon',
  match: function (lines) {
    return (_U.peak(lines) || '').match(colonRgxp);
  },
  methods: {
    consume: function (lines) {
      this.indent = _U.indentLevel(lines.peak());
      var content = lines.popWhile(colonRgxp);
      var rmColon = function (s) { return s.replace(colonRgxp, ''); };
      this.content = _.map(content.asArray(), rmColon).join('\n');
    }
  }
});

module.exports = exports = Colon;