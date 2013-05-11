var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var DlItem = require('./dlitem');

var Dlist = List.define({
  itemType: DlItem,
  type: 'dl',
  methods: {
    prepare: function (lines) {}
  }
});

module.exports = exports = Dlist;