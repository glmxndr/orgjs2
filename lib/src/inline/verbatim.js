var _U = require('../utils');
var Inline = require('../inline');

var verbRgxp = /(^|[\s\S]*[^\\])(([=~])([^\s][\s\S]*?[^\s\\]|[^\s\\])\3)/g;

var verbTypes = {};

var Verbatim = verbTypes['~'] = Inline.define({
  type: 'verbatim',
  replace: function (txt, parent, tp, tokens) {
    var replaceFn = function () {
      var a     = arguments;
      var pre   = a[1];
      var raw   = a[2];
      var type  = a[3] || "";
      var inner = a[4] || "";
      var tknRgxp = new RegExp(tp + ':\\d+;', 'g');
      inner = inner.replace(tknRgxp, function (m) {
        var dest = tokens[m];
        if (dest.raw) {return dest.raw;}
        return m;
      });

      var token = "";
      if (raw) {
        var VerbConstr = verbTypes[type];
        var verb       = new VerbConstr(parent);
        verb.raw       = raw;
        verb.content   = inner;
        token          = _U.newToken(tp);
        tokens[token]  = verb;
      }
      return pre + token;
    };
    do {
      txt = txt.replace(verbRgxp, replaceFn);
    } while (verbRgxp.exec(txt));
    return txt;
  }
});

var Code = verbTypes['='] = Inline.define({
  parent: Verbatim,
  type: 'code'
});

Verbatim.types = verbTypes;

module.exports = exports = Verbatim;