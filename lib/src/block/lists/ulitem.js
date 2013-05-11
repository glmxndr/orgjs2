var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item');

var ulitemRgxp = /^\s*[\+\*-]\s/;

var UlItem = Block.define({
  parent: Item,
  type: 'ulitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(ulitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 2;
      // Remove the list marker
      line = line.replace(/^(\s*)[+*-]\s/, '$1  ');
      // Parse and remove the checkbox if present
      var chkbox = _U.ensure(line.match(/^\s*\[([ X-])\]\s/), [])[1];
      if (chkbox) {
        this.properties.checkbox = chkbox;
        line = line.replace(/^(\s*)\[[ X-]\]\s/, '$1');
      }
      // Push the modified line to parse the list item content
      lines.push(line);
    }
  }
});

module.exports = exports = UlItem;