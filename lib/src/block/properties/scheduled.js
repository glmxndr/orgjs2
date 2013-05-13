var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*SCHEDULED: <(\d{4}-\d\d-\d\d) [A-Za-z]{3}>\s*$/g;

var Scheduled = Block.define({
  type: 'scheduled',
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

module.exports = exports = Scheduled;