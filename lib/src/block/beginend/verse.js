var Block    = require('../../block');
var BeginEnd = require('./beginend');

var Verse = Block.define({
  parent: BeginEnd,
  type: 'verse',
  methods: {
    params: function (line) {
      this.indent = /^(\s*)/.exec(line || '')[1].length;
    },
    finalize: function () {
      var lines = this.lines.asArray();
      var lastLine = lines.pop();
      var m = lastLine && (lastLine.match(/^\s*--\s+(.*)\s*$/));
      if(m) {
        this.signature = this.parseInline(m[1]);
      } else {
        lines.push(lastLine);
      }
      var i = this.indent;
      var rgxp = new RegExp('^ {' + this.indent + '}');
      lines = _.map(lines, function (l) { return l.replace(rgxp, ''); });
      this.content = this.parseInline(lines.join('\n'));
    }

  }
});

module.exports = exports = Verse;