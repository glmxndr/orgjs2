var _U    = require('../utils');
var Block = require('../block');

var rgxp = /^\s*\[\[([^\]]+(?:png|jpe?g|gif))\]\]\s*$/i;

var Illust = Block.define({
  type: 'illust',
  match: function (lines, parent) {
    var line = lines.peakOverProperties();
    return line.match(rgxp);
  },
  methods: {
    prepare: function (lines) {  },
    consume: function (lines) {
      var props = lines.properties();
      this.setProperties(props);
      var line = this.raw = lines.pop();
      this.url = rgxp.exec(line)[1];
    }
  }
});

module.exports = exports = Illust;