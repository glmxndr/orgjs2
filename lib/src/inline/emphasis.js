var _U = require('../utils');
var Inline = require('../inline');

var emphRgxp = /(^|[\s\S]*[^\\])(([\/*+_])([^\s][\s\S]*?[^\s\\]|[^\s\\])\3)/g;

var Emphasis = Inline.define({
  type: 'emphasis',
  replace: function (txt, parent, tp, tokens) {
    var matcher;
    var replaceFn = function () {
      var a     = arguments;
      var pre   = a[1];
      var raw   = a[2];
      var type  = a[3] || "";
      var inner = a[4] || "";
      var token = "";
      if (raw) {
        var EmphConstr = Emphasis.types[type];
        var emph       = new EmphConstr(parent);
        emph.raw       = raw;
        emph.append(emph.parseInline(inner, tp, tokens));
        token          = _U.newToken(tp);
        tokens[token]  = emph;
      }
      return pre + token;
    };
    do {
      txt = txt.replace(emphRgxp, replaceFn);
      matcher = emphRgxp.exec(txt);
    } while (matcher);
    return txt;
  }
});

var define = function (type) {
  return Inline.define({
    'parent': Emphasis, 
    'type'  : type
  });
};

Emphasis.types = {
  '/': Emphasis,
  '*': define('strong'),
  '_': define('underline'),
  '+': define('strike')
};

module.exports = exports = Emphasis;