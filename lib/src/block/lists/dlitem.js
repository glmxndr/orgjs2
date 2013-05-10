var _U    = require('../../utils');
var Block = require('../../block');
var Item  = require('./_item') ;

var dlitemRgxp = /^(\s*)[\+\*-]\s+(.*?)\s*::\s*/;

var DlItem = Block.define({
  parent: Item,
  type: 'dlitem',
  match: function (lines, parent) {
    return _U.ensure(_U.peak(lines),'').match(dlitemRgxp);
  },
  methods: {
    prepare: function (lines) {
      var line = lines.pop();
      this.indent = _U.indentLevel(line) + 2;
      // Get the tag name
      var m = line.match(dlitemRgxp);
      this.tag = this.parseInline(m[2]);
      // Remove the list marker
      line = line.replace(dlitemRgxp, '$1  ');
      // Push the modified line to parse the list item content
      if (_U.notBlank(line)) { lines.push(line); }
    }
  }
});

module.exports = exports = DlItem;