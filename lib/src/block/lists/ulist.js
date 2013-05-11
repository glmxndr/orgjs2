var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var UlItem = require('./ulitem');

var Ulist = List.define({
  itemType: UlItem,
  type: 'ul',
  methods: {
    prepare: function (lines) {}
  }
});

module.exports = exports = Ulist;