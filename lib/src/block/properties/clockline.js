var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*CLOCK: \[(\d{4}-\d\d-\d\d) [A-Za-z]{3}\.? (\d\d:\d\d)\](?:--\[(\d{4}-\d\d-\d\d) [A-Za-z]{3}\.? (\d\d:\d\d)\] =>\s*(-?\d+:\d\d))?\s*$/g;

var Clockline = Block.define({
  type: 'clockline',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
    }
  }
});

module.exports = exports = Clockline;