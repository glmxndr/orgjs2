var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Comment = Block.define({
  parent: BeginEnd,
  type: 'comment',
  methods: {}
});

module.exports = exports = Comment;