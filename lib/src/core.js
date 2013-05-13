var _U           = require('./utils');
var RenderEngine = require('./render/engine');
var HtmlMatchers = require('./render/default/html');
var Block        = require('./block');
var Inline       = require('./inline');

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
    Hr         : Block.register( 100, require('./block/special/hr')),
    FnDef      : Block.register( 200, require('./block/special/fndef')),
    Example    : Block.register( 300, require('./block/beginend/example')),
    Quote      : Block.register( 300, require('./block/beginend/quote')),
    Center     : Block.register( 300, require('./block/beginend/center')),
    Comment    : Block.register( 300, require('./block/beginend/comment')),
    Verse      : Block.register( 300, require('./block/beginend/verse')),
    Src        : Block.register( 300, require('./block/beginend/src')),
    Dlist      : Block.register( 500, require('./block/lists/dlist')),
    DlItem     : Block.register( 510, require('./block/lists/dlitem')),
    Ulist      : Block.register( 520, require('./block/lists/ulist')),
    UlItem     : Block.register( 530, require('./block/lists/ulitem')),
    Olist      : Block.register( 540, require('./block/lists/olist')),
    OlItem     : Block.register( 550, require('./block/lists/olitem')),
    Drawer     : Block.register(1000, require('./block/special/drawer')),
    Section    : Block.register(8000, require('./block/section')),
    PropDef    : Block.register(8500, require('./block/properties/propdef')),
    CommentLine: Block.register(9000, require('./block/special/commentline')),
    Para       : Block.register(9999, require('./block/para'))
  },
  inline: {
    Link      : Inline.register( 100, require('./inline/link')),
    Latex     : Inline.register( 200, require('./inline/latex')),
    FnRef     : Inline.register( 300, require('./inline/fnref')),
    Entity    : Inline.register( 400, require('./inline/entity')),
    Verbatim  : Inline.register( 500, require('./inline/verbatim')),
    Emphasis  : Inline.register(1000, require('./inline/emphasis')),
    Linebreak : Inline.register(1100, require('./inline/linebreak')),
    Regular   : Inline.register(9999, require('./inline/regular'))
  }
};

var global = (function(){return this;}());
global.Org = Org;

module.exports = exports = Org;