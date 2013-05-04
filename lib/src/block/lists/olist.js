var _U    = require('../../utils');
var Block = require('../block');

var OlItem = require('./olitem');

var Olist = Block.define({
  parent: Block,
  type: 'ol',
  registerLevel: 'medium',
  match: OlItem.match,
  methods: {
    accepts: function (lines) {
      return OlItem.match(lines) && _U.indentLevel(lines.peak()) === this.indent;
    },
    consume: function (lines) {
      this.indent = _U.indentLevel(lines.peak());
      this.count = 0;
      do {
        var item = new OlItem(this.org, this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Olist;