var Block    = require('../block');
var BeginEnd = require('./beginend');

var Src = Block.define({
  parent: BeginEnd,
  type: "src",
  registerLevel: "medium",
  match: BeginEnd.match,
  methods: {
    params: function (line) {
      var match = /^\s*#\+begin_src\s+([a-z\-]+)(?:\s|$)/i.exec(line);
      this.language = match ? match[1] : null;
      // TODO: deal with switches (see org doc 11.3)
    }
  }
});

module.exports = exports = Src;