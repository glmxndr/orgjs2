var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Quote = Block.define({
  parent: BeginEnd,
  type: 'quote',
  methods: {
    finalize: function () {
      var lines = this.lines.asArray();
      var lastLine = lines.pop();
      var m = lastLine && (lastLine.match(/^\s*--\s+(.*)\s*$/));
      if(m) {
        this.signature = this.parseInline(m[1]);
      } else {
        lines.push(lastLine);
      }
      this.content = this.parseInline(lines.join('\n'));
    }
  }
});

module.exports = exports = Quote;