var _U     = require('../utils');
var Inline = require('../inline');

var Regular = Inline.define({
  type: 'regular',
  registerLevel: 'lowest',
  replace: function (txt, parent, tokenPrefix, tokens) {
    var tp = tokenPrefix;
    var rgxp = new RegExp(
      [
        '(?:^|', tp, ':[0-9]+;)', 
        '([\\s\\S]*?)', 
        '(?:', tp, '|$)'
      ].join(''), 
      'g'
    );
    return txt.replace(rgxp, function (m, g1) {
      if (g1.length === 0 || g1.indexOf(tp) > -1) { return m; }
      var reg = new Regular(parent);
      reg.content = g1;
      var regToken = _U.newToken(tp);
      tokens[regToken] = reg;
      return regToken;
    });
  }
});

