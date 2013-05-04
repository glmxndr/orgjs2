var _     = require('lodash');
var _U    = require('../../utils');
var Block = require('../block');

var BeginEnd = (function () { 

  var makeRgxp = (function () {
    var memoResolver = function () { return _U.array(arguments).join(' '); };
    var result = function (be, type) {
      return new RegExp('^\\s*#\\+' + be + '_' + type, 'i');
    };
    return _.memoize(result, memoResolver);
  }());

  return Block.define({
    parent: Block,
    type: "beginend",
    match: function (lines, parent) {
      var beginRgxp = makeRgxp('begin', this.type);
      return _U.ensure(_U.peak(lines), '').match(beginRgxp);
    },
    methods: {
      accepts: function (lines) { return false; },
      params: function (line) {},
      consume: function (lines) {
        this.params(lines.pop());
        var endRgxp = makeRgxp('end', this.type);
        this.content = lines.popUntil(endRgxp);
        lines.pop(); // Remove the end line
        lines.trimBlank();
        this.finalize();
      },
      finalize: function () {}
    }
  });

}());

module.exports = exports = BeginEnd;