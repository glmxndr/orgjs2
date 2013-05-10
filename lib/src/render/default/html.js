var _U = require('../../utils');
var j  = _U.join;

var silent = function () {return '';};

var raw = function () { return this.raw; };

var tag = function (name, content) {
  return j('<', name, '>', content, '</', name, '>'); 
};

var tagchildren = function (t) { 
  return function (r) { 
    return tag(t, r(this.children())); 
  };
};

var tagcontent = function (t) { 
  return function (r) { 
    return tag(t, r(this.content)); 
  };
};

var defaultHtmlMatchers = {
  document: function (r) {
    return tag('article', j(r(this.content), r(this.children())));
  },
  section: function (r) {
    return j(
      '<section>', 
      r(this.headline), 
      r(this.content), 
      r(this.children()), 
      '</section>'
    );
  },
  headline: function (r) {
    return tag('h' + this.level, r(this.children()));
  },
  content: tagchildren('div'),

  // Blocks
  para: tagchildren('p'),
  hr: function (r) { return '<hr/>'; },
  fndef: raw,
  propdef: silent,
  commentline: silent,

  // List blocks
  ul: tagchildren('ul'),
  ulitem: tagchildren('li'),
  ol: tagchildren('ol'),
  olitem: tagchildren('li'),
  dl: tagchildren('dl'),
  dlitem: function (r) {
    return j('<dt>', r(this.desc), '</dt><dd>', r(this.children()), '</dd>');
  },

  // Begin-end blocks
  verse: tagchildren('pre'),
  src: tagchildren('pre'),
  quote: tagchildren('blockquote'),
  example: tagchildren('pre'),
  comment: function (r) {
    return j('<!--', this.raw, '-->');
  },

  // Inline
  regular: function (r) {return this.content;},
  emphasis: tagchildren('em'),
  strong: tagchildren('b'),
  underline: tagchildren('u'),
  strike: tagchildren('s'),

  entity: function (r) { return this.content.html; },
  fnref: raw,

  latex: tagcontent('code'),
  verbatim: tagcontent('tt'),
  code: tagcontent('code'),

  link: function (r) {
    return tag('a', this.desc || this.target);
  }
};

module.exports = exports = defaultHtmlMatchers;