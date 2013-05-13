var _U     = require('../utils');
var Inline = require('../inline');

var Linebreak = Inline.define({
  type: 'linebreak',
  replace: function (txt, parent, tp, tokens) {
    txt = txt.replace(/\\\\$/mg, function (m, e) {
      var lb        = new Linebreak(parent);
      var token     = _U.newToken(tp);
      tokens[token] = lb;
      return token;
    });
    return txt;
  }
});

module.exports = exports = Linebreak;