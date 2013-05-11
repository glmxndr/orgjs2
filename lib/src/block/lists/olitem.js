var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item') ;

var olitemRgxp = /^(\s*)\d+[\.)]\s/;

var OlItem = Block.define({
  parent: Item,
  type: 'olitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(olitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 3;
      // Remove the list marker
      line = line.replace(olitemRgxp, '$1   ');
      // Remove the item number if present
      var num = _U.ensure(line.match(/^\s*\[@(\d+)\]\s/), [])[1];
      if (num) {
        this.num = parseInt(num, 10);
        this.parent.properties.start = this.num;
        line = line.replace(/^(\s*)\[@(\d+)\]\s/, '$1');
      } else {
        this.num = ++(this.parent.count);
      }
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


module.exports = exports = OlItem;