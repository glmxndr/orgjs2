var _U      = require('../utils');
var Block   = require('../block');
var Lines   = require('./lines');

var Para = Block.define({
  parent: Block,
  type: "para",
  registerLevel: "lowest",
  match: function (lines, parent) {
    return true;
  },
  methods: {
    init: function () {
      this.lines = [];
    },
    accepts: function (lines) {
      var line = lines.peak();
      // Check for empty line
      if (_U.blank(line)) { return false; }

      // Check for other type of line
      var testType = _U.ensure(Block.get(lines)).type;
      if (testType !== "para") { return false; }

      // Check for indentation
      var indent = _U.indentLevel(line);
      var parentIndent = this.parentIndent();
      if (indent === 0 && parentIndent > 0) {return false;}
      if (indent > 0 && indent < parentIndent) {return false;}
      return true;
    },
    consume: function (lines) {
      do {
        this.lines.push(lines.pop());
      } while (this.accepts(lines));
      lines.trimBlank();

      this.content = this.parseInline(this.lines.join('\n'), this);
    }
  }
});

module.exports = exports = Para;