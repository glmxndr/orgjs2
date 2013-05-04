var _U    = require('../../utils');
var Block = require('../block');

var OlItem = Block.define({
  parent: Block,
  type: 'olitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(/^\s*\d[.)]\s/);
  },
  methods: {
    accepts: function (lines) {
      return _U.indentLevel(lines.peak()) >= this.indent;
    },
    prepare: function (lines) {
      var line = lines.pop();
      // Remove the list marker
      line = line.replace(/^(\s*)\d[.)]\s/, '$1   ');
      this.indent = _U.indentLevel(lines.peak()) + 3;
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
    },
    consume: function (lines) {
      var next;
      this.prepare(lines);
      do {
        next = new (Block.get(lines))(this.org, this);
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = OlItem;