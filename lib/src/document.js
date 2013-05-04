var Block   = require('./block');
var Section = require('./section');

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {}
});