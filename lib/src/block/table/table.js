var _U          = require('../../utils');
var Block       = require('../../block');
var TableRow    = require('./row');

var rowDelimRgxp = _U.rgxp.tableRowDelim;

var Table = Block.define({
  parent: Block,
  type: 'table',
  match: TableRow.match,
  methods: {
    accepts: function (lines) {
      var line = lines.peak();
      return _U.rgxp.tableRow.exec(line) && 
        _U.indentLevel(line) === this.indent;
    },
    consume: function (lines) {
      var line = lines.peak();
      while (line.match(rowDelimRgxp)) { lines.pop(); line = lines.peak(); }
      this.indent = _U.indentLevel(line);
      this.tableHead = new TableRow(this);
      this.tableHead.consume(lines);
      do {
        var row = new TableRow(this);
        this.append(row);
        row.consume(lines);
      } while (this.accepts(lines));
    },
    lastRow: function () { return _.last(this.children()); }
  }
});

module.exports = exports = Table;
