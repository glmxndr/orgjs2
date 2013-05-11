var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Example = Block.define({
  parent: BeginEnd,
  type: 'example',
  methods: {}
});

module.exports = exports = Example;