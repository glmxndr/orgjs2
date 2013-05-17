var _U     = require('../utils');
var _      = _U._;
var Inline = require('../inline');

var linkDescRgxp   = /\[\[([^\]]*?[^\s\\])\](?:\[([^\]]*[^\\])\])?\]/g;
var linkBareRgxp   = /((?:http|https|ftp|mailto|file|news|shell|elisp|doi|message):(?:[\w\.\/\?\*\+#@!$&'_~:,;=-]|%[\dA-F]{2})+)/ig;

var Link = Inline.define({
  type: 'link',
  replace: function (txt, parent, tp, tokens) {
    var replaceFn = function (raw, uri, desc) {
      var token     = "";
      var link      = new Link(parent);
      link.raw      = raw;
      link.target   = uri ? uri : raw;
      link.desc     = desc ? link.parseInline(desc) : null;
      token         = _U.newToken(tp);
      tokens[token] = link;
      return token;
    };
    // Full described link
    txt = txt.replace(linkDescRgxp, replaceFn);
    // Bare
    txt = txt.replace(linkBareRgxp, replaceFn);
    return txt;
  }
});

module.exports = exports = Link;
