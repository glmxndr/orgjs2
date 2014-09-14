var _U        = require('../../utils');
var Block     = require('../../block');
var TableCell = require('./cell');

var rowRgxp = _U.rgxp.tableRow;
var rowDelimRgxp = _U.rgxp.tableRowDelim;

var TableRow = Block.define({
  parent: Block,
  type: 'tablerow',
  match: function (lines) { return (_U.peak(lines) || '').match(rowRgxp); },
  methods: {
    consume: function (lines) {
      var line = lines.peak();
      this.indent = _U.indentLevel(line);
      var content = lines.pop();

      var cellsContent = content.trim().replace(/^\||\|$/g, '').split('|');

      var row = this;
      _.map(cellsContent, function(c) { 
        var cell = new TableCell(row); 
        row.append(cell);
        cell.consume(c);
        return cell;
      });

      // Remove the delimiters, not taken into account for now
      while (lines.peak().match(rowDelimRgxp)) { lines.pop(); }
    }
  }
});

module.exports = exports = TableRow;