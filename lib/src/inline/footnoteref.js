var _U          = require('../utils');
var Inline      = require('../inline');
var FootnoteDef = require('../block/special/footnotedef');
var Lines       = require('../block/lines');

var fnrefRgxp = /\[(?:(\d+)|fn:([^:]*)(?::([\s\S]+?))?)\]/g;

var FootnoteRef = Inline.define({
  type: 'fnref',
  registerLevel: 200,
  replace: function (txt, parent, tp, tokens) {
    return txt.replace(fnrefRgxp, function () {
      var a    = arguments;
      var raw  = a[0];
      var name = a[2] || a[1];

      if (a[3]) {
        var def = a[3];
        var section = parent.section();
        var fnDef = new FootnoteDef(section.content);
        section.content.append(fnDef);
        name = "anon_" + _U.randomStr(5);
        fnDef.consume(new Lines(_U.join('[fn:', name, '] ', def)));
        name = fnDef.num;
      }

      var fn = new FootnoteRef(parent);
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
