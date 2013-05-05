var _U    = require('../../utils');
var Block = require('../block');
var Item  = require('./_item');

var UlItem = Block.define({
  parent: Item,
  type: 'ulitem',
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 2;
      // Remove the list marker
      line = line.replace(/^(\s*)[+*-]\s/, '$1  ');
      // Parse and remove the checkbox if present
      var chkbox = _U.ensure(line.match(/^\s*\[([ X-])\]\s/), [])[1];
      if (chkbox) {
        this.chkbox = chkbox;
        line = line.replace(/^(\s*)\[[ X-]\]\s/, '$1');
      }
      // Push the modified line to parse the list item content
      lines.push(line);
    }
  }
});

UlItem.rgxp = /^\s*[+*-]\s/;

module.exports = exports = UlItem;