var _U    = require('../../utils');
var Block = require('../../block');
var List  = require('./_list');

var OlItem = require('./olitem');

var olRgxp = /^(\s*)\d+[\.)]\s/;

var Olist = List.define({
  itemType: OlItem,
  type: 'ol',
  match: function (lines, parent) {
    var line = lines.peakOverProperties();
    return line.match(olRgxp);
  },
  methods: {
    prepare: function (lines) { this.count = 0; },
    consume: function (lines) {
      var props = lines.properties();
      this.setProperties(props);

      this.indent = _U.indentLevel(lines.peak());
      this.prepare(lines);
      do {
        var item = new OlItem(this);
        this.append(item);
        item.consume(lines);
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Olist;