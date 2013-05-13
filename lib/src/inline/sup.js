var _U     = require('../utils');
var Inline = require('../inline');
var Sub    = require('./sub');

var Sup = Inline.define({
  parent: Sub,
  type: 'sup',
  attrs: {
    rgxp: /(\S)\^(?:(\*|[+-]?\w+)|\{([^\}]*)\})/g
  }
});

module.exports = exports = Sup;