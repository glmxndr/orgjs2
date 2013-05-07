var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Comment = Block.define({
  parent: BeginEnd,
  type: "comment",
  registerLevel: "medium",
  methods: {}
});

module.exports = exports = Comment;