var _U = require('./utils');
var RenderEngine = require('./render/engine');
var HtmlMatchers = require('./render/default/html');

var Org = function (obj) {
  obj = obj || {};
  this.config = require('./config').prepare(obj);
  var that = this;
  this.parse = {
    headline: require('./block/headline').parser(that),
    document: require('./document').parser(that),
    inline: require('./inline').parser(that)
  };

  this.render = {
    defaults: {
      html: new RenderEngine({matchers: HtmlMatchers})
    }
  };
};

Org.prototype = {
  parseDocument: function (content) {
    return this.parse.document(content);
  },
  parseDocumentAt: function (location) {
    return this.parseDocument(_U.load(location));
  }
};

// Exposing components 
// (and forcing them to load, so that they can plug themselves).
Org.components = {
  Document : require('./document'),
  block: {
    Section    : require('./block/section'),
    PropDef    : require('./block/properties/propdef'),
    CommentLine: require('./block/special/commentline'),
    Hr         : require('./block/special/hr'),
    FnDef      : require('./block/special/fndef'),
    Example    : require('./block/beginend/example'),
    Quote      : require('./block/beginend/quote'),
    Comment    : require('./block/beginend/comment'),
    Verse      : require('./block/beginend/verse'),
    Src        : require('./block/beginend/src'),
    Ulist      : require('./block/lists/ulist'),
    UlItem     : require('./block/lists/ulitem'),
    Olist      : require('./block/lists/olist'),
    OlItem     : require('./block/lists/olitem'),
    Dlist      : require('./block/lists/dlist'),
    DlItem     : require('./block/lists/dlitem'),
    Drawer     : require('./block/special/drawer'),
    Para       : require('./block/para')
  },
  inline: {
    Link    : require('./inline/link'),
    Entity  : require('./inline/entity'),
    Regular : require('./inline/regular'),
    FnRef   : require('./inline/fnref'),
    Emphasis: require('./inline/emphasis'),
    Verbatim: require('./inline/verbatim'),
    Latex   : require('./inline/latex')
  }
};

var global = (function(){return this;}());
global.Org = Org;

module.exports = exports = Org;