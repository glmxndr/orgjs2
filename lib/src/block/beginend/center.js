var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Center = Block.define({
  parent: BeginEnd,
  type: 'center',
  methods: {}
});

module.exports = exports = Center;