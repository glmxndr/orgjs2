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
  document: function (r, doc) {
    var result = [];
    var title = doc.properties.title;
    if (title) {
      result.push(tag('h1', j(r(doc.parseInline(title)))));
    }
    result.push(tag('article', j(r(doc.content), r(doc.children()))));

    if (doc.footnotes.length > 0) {
      result.push('<hr/>');
      _.each(doc.footnotes, function (fndef) {
        var n = fndef.number;
        var content = r(fndef.children());
        var fnHtml = j(
          '<a name="fn-', n, '"></a>',
          '<table class=""fn><tr><td>',
          '<sup><a href="#fnref-', n, '">', n, '</a></sup> ', 
          '</td><td>',
          content,
          '</td></tr></table>'
        );
        result.push(fnHtml);
      });
    }

    return result.join('');
  },
  section: function (r) {
    return tag('section',
      j(r(this.headline), 
        r(this.content), 
        r(this.children())));
  },
  headline: function (r) {
    return tag('h' + this.level, r(this.title));
  },
  content: tagchildren('div'),

  // Blocks
  para: tagchildren('p'),
  hr: function (r) { return '<hr/>'; },
  illust: function (r) {
    var s = '';
    if (this.properties.caption) { 
      s = tag('figcaption', r(this.parseInline(this.properties.caption))); 
    }
    return j(
      '<figure class="illust">',
      '<img src="', this.url, '"/>',
      s,
      '</figure>'
    );
  },

  // List blocks
  ul: tagchildren('ul'),
  ulitem: tagchildren('li'),
  ol: function (r) {
    var start = this.properties.start || 1;
    var type = this.properties.type || '1';
    return j(
      '<ol start="', start, '" type="', type, '">', 
      r(this.children()), 
      '</ol>'
    );
  },
  olitem: tagchildren('li'),
  dl: tagchildren('dl'),
  dlitem: function (r) {
    return j('<dt>', r(this.tag), '</dt><dd>', r(this.children()), '</dd>');
  },

  // Drawers
  drawer: function (r) { return ''; },

  // Begin-end blocks
  verse: function (r) {
    var s = '';
    if (this.signature) { 
      s = tag('figcaption', r(this.signature)); 
    }
    return j(
      '<figure class="verse">', 
      tag('pre', r(this.content)), 
      s, 
      '</figure>'
    );
  },
  src: tagcontent('pre'),
  quote: function (r) {
    var s = '';
    if (this.signature) { 
      s = tag('figcaption', r(this.signature)); 
    }
    return j(
      '<figure class="quote">', 
      tag('blockquote', r(this.content)), 
      s, 
      '</figure>'
    );
  },
  example: tagcontent('pre'),
  center: tagcontent('center'),

  // Inline
  regular: function (r) {return this.content;},
  emphasis: tagchildren('em'),
  strong: tagchildren('strong'),
  underline: tagchildren('u'),
  strike: tagchildren('s'),
  sub: tagcontent('sub'),
  sup: tagcontent('sup'),

  entity: function (r) { return this.content.html; },
  linebreak: function (r) { return '<br/>'; },
  fnref: function (r, fnref) {
    var n;
    try { n = this.document().footnoteByName(fnref.name).number; }
    catch(e) { 
      _U.log.error('No footnote defined with name ' + fnref.name); 
      return ''; 
    }
    return j(
      '<a name="fnref-', n, '"></a>',
      '<sup><a href="#fn-', n, '">', n, '</a></sup>'
    );
  },

  latex: tagcontent('code'),
  verbatim: tagcontent('tt'),
  code: tagcontent('code'),

  link: function (r) {
    return j('<a href="', this.target, '">', r(this.desc || this.target), '</a>');
  }
};

module.exports = exports = defaultHtmlMatchers;