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
    consume: function (lines) {
      var next;
      this.indent = _U.indentLevel(lines.peak()) + 2;
      lines.push(lines.pop().replace(/^(\s*)[+*-]\s/, '$1  '));
      do {
        next = new (Block.get(lines))(this.org, this);
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      } while (this.accepts(lines));
    }
  }
});

var Ulist = Block.define({
  parent: Block,
  type: 'ul',
  registerLevel: 'medium',
  match: UlItem.match,
  methods: {
    accepts: function (lines) {
      return UlItem.match(lines) && _U.indentLevel(lines.peak()) === this.indent;
    },
    consume: function (lines) {
      this.indent = _U.indentLevel(lines.peak());
      do {
        var item = new UlItem(this.org, this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Ulist;