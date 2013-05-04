var Block    = require('../block');
var BeginEnd = require('./beginend');

var Verse = Block.define({
  parent: BeginEnd,
  type: "verse",
  registerLevel: "medium",
  match: BeginEnd.match,
  methods: {}
});

module.exports = exports = Verse;