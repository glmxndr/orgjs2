var _U      = require('../../utils');
var Block   = require('../../block');

var propRgxp = _U.rgxp.propLine;

var PropDef = Block.define({
  type: 'propdef',
  match: function (lines, parent) {
    var line = (_U.peak(lines) || '');
    return !!line.match(propRgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
      var m = line.match(propRgxp);
      var key = m[1];
      var value = m[2];
      var section = this.section();
      if (section.properties[key]) {
        section.properties[key] = section.properties[key] + '\n' + value;
      } else {
        section.properties[key] = value;
      }
    }
  }
});

module.exports = exports = PropDef;