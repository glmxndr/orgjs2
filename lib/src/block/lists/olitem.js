var _U    = require('../../utils');
var Block = require('../block');
var Item  = require('./_item') ;

var OlItem = Block.define({
  parent: Item,
  type: 'olitem',
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 3;
      // Remove the list marker
      line = line.replace(/^(\s*)\d[.)]\s/, '$1   ');
      // Remove the item number if present
      var num = _U.ensure(line.match(/^\s*\[@(\d+)\]\s/), [])[1];
      if (num) {
        this.num = parseInt(num, 10);
        this.parent.count = this.num;
        line = line.replace(/^(\s*)\[@(\d+)\]\s/, '$1');
      } else {
        this.num = ++(this.parent.count);
      }
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

OlItem.rgxp = /^(\s*)\d[.)]\s/;

module.exports = exports = OlItem;