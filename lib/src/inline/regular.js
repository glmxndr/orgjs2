var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var Regular = Inline.define({
  type: 'regular',
  registerLevel: 9999,
  replace: function (txt, parent, tp, tokens) {
    var tknRgxp = new RegExp(tp + ':\\d+;', 'g');
    var pieces = txt.split(tknRgxp);
    _.each(pieces, function (p) {
      if (p.length === 0) {return;}
      var reg = new Regular(parent);
      reg.content = p;
      var regToken = _U.newToken(tp);
      tokens[regToken] = reg;
      txt = txt.replace(p, regToken);
    });
    return txt;
  }
});

module.exports = exports = Regular;