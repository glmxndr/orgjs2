var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*#\+CAPTION(?:\[([^\]]*)\])?:\s*(.*?)\s*$/i;

var Caption = Block.define({
  type: 'label-def',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
      var m = rgxp.exec(line);
      this.document().caption(m[2]);
      if (m[1]) { this.document().captionShort(m[1]); }
    }
  }
});

module.exports = exports = Caption;