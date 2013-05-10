var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Center = Block.define({
  parent: BeginEnd,
  type: "center",
  registerLevel: "medium",
  methods: {}
});

module.exports = exports = Center;