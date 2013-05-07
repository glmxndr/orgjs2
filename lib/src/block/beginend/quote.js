var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Quote = Block.define({
  parent: BeginEnd,
  type: "quote",
  registerLevel: "medium",
  methods: {}
});

module.exports = exports = Quote;