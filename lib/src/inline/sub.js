var _U     = require('../utils');
var Inline = require('../inline');

var Sub = Inline.define({
  type: 'sub',
  attrs: {
    rgxp: /(\S)_(?:(\*|[+-]?\w+)|\{([^\}]*)\})/g
  },
  replace: function (txt, parent, tp, tokens) {
    var Constr = this;
    return txt.replace(this.rgxp, function () {
      var a       = arguments;
      this.raw    = a[0].substr(1);
      var content = a[3] || a[2];

      var inline = new Constr(parent);
      inline.define(content);

      var token = _U.newToken(tp);
      tokens[token] = inline;
      return a[1] + token;
    });
  },
  methods: {
    define: function (content) {
      this.content = this.parseInline(content);
    }
  }
});

module.exports = exports = Sub;