var _U    = require('../../utils');
var Block = require('../block');

var UlItem = Block.define({
  parent: Block,
  type: 'ulitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(/^\s*[+*-]\s/);
  },
  methods: {
    accepts: function (lines) {
      return _U.indentLevel(lines.peak()) >= this.indent;
    },
    prepare: function (lines) {
      var line = lines.pop();
      // Remove the list marker
      line = line.replace(/^(\s*)[+*-]\s/, '$1  ');
      this.indent = _U.indentLevel(lines.peak()) + 2;
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

module.exports = exports = UlItem;