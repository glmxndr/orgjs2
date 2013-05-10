var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var Latex = Inline.define({
  type: 'latex',
  registerLevel: 100,
  replace: function (txt, parent, tp, tokens) {
    var regexps = [
      /(^|[\s\S]*[^\\])((\$\$)([\s\S]*?[^\\])\$\$)/g,
      /(^|[\s\S]*[^\\])((\$)([^\s][\s\S]*?[^\s\\]|[^\s\\])\$)/g,
      /(^|[\s\S]*[^\\])((\\\()([\s\S]*?[^\\])\\\))/g,
      /(^|[\s\S]*[^\\])((\\\[)([\s\S]*?[^\\])\\\])/g
    ];
    _.each(regexps, function (rgxp) {
      var replaceFn = function () {
        var a     = arguments;
        var pre   = a[1];
        var raw   = a[2];
        var type  = a[3] || "";
        var inner = a[4] || "";
        var token = "";
        if (raw) {
          var latex     = new Latex(parent);
          latex.raw     = raw;
          latex.content = inner;
          token         = _U.newToken(tp);
          tokens[token] = latex;
        }
        return pre + token;
      };
      do {
        txt = txt.replace(rgxp, replaceFn);
      } while (rgxp.exec(txt));
    });
    return txt;
  }
});

module.exports = exports = Latex;

