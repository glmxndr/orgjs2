var _U     = require('../utils');
var Inline = require('../inline');
var FnDef  = require('../block/special/fndef');
var Lines  = require('../block/lines');

var fnrefRgxp = /\[(?:(\d+)|fn:([^:]*)(?::([\s\S]+?))?)\]/g;

var FnRef = Inline.define({
  type: 'fnref',
  registerLevel: 200,
  replace: function (txt, parent, tp, tokens) {
    return txt.replace(fnrefRgxp, function () {
      var a    = arguments;
      var raw  = a[0];
      var name = a[2] || a[1];

      if (a[3]) {
        var def = a[3];
        var doc = parent.document();
        var fnDef = new FnDef(parent);
        name = "anon_" + _U.randomStr(5);
        fnDef.consume(new Lines(_U.join('[fn:', name, '] ', def)));
      }

      var fn = new FnRef(parent);
      fn.define(raw, name);

      var fnToken = _U.newToken(tp);
      tokens[fnToken] = fn;
      return fnToken;
    });
  },
  methods: {
    define: function (raw, name) {
      this.raw = raw;
      this.name = name;
    }
  }
});

module.exports = exports = FnRef;