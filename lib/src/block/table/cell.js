var _U       = require('../../utils');
var Block    = require('../../block');

var TableCell = Block.define({
  type: 'tablecell',
  methods: {
    accepts: function (lines) { return true; },
    consume: function (content) { this.append(this.parseInline(content)); }
  }
});

module.exports = exports = TableCell;