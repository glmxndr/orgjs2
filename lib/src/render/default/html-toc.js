var _U = require('../../utils');
var j  = _U.join;

var html = require('./html');

var toc = {
  document: function (r, doc) {
    return j('<ul class="toc">', r(this.children(), '</ul>'));
  },
  section: function (r) {
    return j(
      '<li>', 
        '<a href="#sect-', this.id, '">', r(this.headline.title), '</a>',
        (this.children() ? j ('<ul>', r(this.children()), '</ul>') : ''),
      '</li>'
    );
  }
};

module.exports = exports = toc;