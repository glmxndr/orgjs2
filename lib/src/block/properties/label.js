var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*#\+LABEL:\s*(.*?)\s*$/i;

var Label = Block.define({
  type: 'label-def',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
      var content = rgxp.exec(line)[1];
      this.document().label(content);
    }
  }
});

module.exports = exports = Label;