var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Example = Block.define({
  parent: BeginEnd,
  type: "example",
  registerLevel: "medium",
  methods: {}
});

module.exports = exports = Example;