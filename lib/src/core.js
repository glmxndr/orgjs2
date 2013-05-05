var _U       = require('./utils');
var Config   = require('./config');
var Headline = require('./block/headline');
var Document = require('./document');
var Inline   = require('./inline/inline');

var Org = function (obj) {
  obj = obj || {};
  this.config = Config.prepare(obj);

  this.parse = {
    headline: Headline.parser(this),
    document: Document.parser(this)
  };

};

// Exposing components 
// (and forcing them to load, so that they can plug themselves).
Org.components = {
  Document      : require('./document'),
  block: {
    Section       : require('./block/section'),
    CommentLine   : require('./block/special/commentline'),
    HorizontalRule: require('./block/special/hr'),
    FootnoteDef   : require('./block/special/footnotedef'),
    Example       : require('./block/beginend/example'),
    Quote         : require('./block/beginend/quote'),
    Comment       : require('./block/beginend/comment'),
    Verse         : require('./block/beginend/verse'),
    Src           : require('./block/beginend/src'),
    Ulist         : require('./block/lists/ulist'),
    UlItem        : require('./block/lists/ulitem'),
    Olist         : require('./block/lists/olist'),
    OlItem        : require('./block/lists/olitem'),
    Dlist         : require('./block/lists/dlist'),
    DlItem        : require('./block/lists/dlitem'),
    Drawer        : require('./block/special/drawer'),
    Para          : require('./block/para')
  },
  inline: {

  }
};

module.exports = exports = Org;