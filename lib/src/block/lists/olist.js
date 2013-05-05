var _U    = require('../../utils');
var Block = require('../block');
var List  = require('./_list');

var OlItem = require('./olitem');

var Olist = List.define({
  itemType: OlItem,
  type: 'ol',
  registerLevel: 'medium',
  methods: {
    prepare: function (lines) { this.count = 0; }
  }
});

module.exports = exports = Olist;