var _U = require('./utils');

var Org = function (obj) {
  obj = obj || {};
  this.config = require('./config').prepare(obj);
  var that = this;
  this.parse = {
    headline: require('./block/headline').parser(that),
    document: require('./document').parser(that),
    inline: require('./inline').parser(that)
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
    Section        : require('./block/section'),
    CommentLine    : require('./block/special/commentline'),
    HorizontalRule : require('./block/special/hr'),
    FootnoteDef    : require('./block/special/footnotedef'),
    Example        : require('./block/beginend/example'),
    Quote          : require('./block/beginend/quote'),
    Comment        : require('./block/beginend/comment'),
    Verse          : require('./block/beginend/verse'),
    Src            : require('./block/beginend/src'),
    Ulist          : require('./block/lists/ulist'),
    UlItem         : require('./block/lists/ulitem'),
    Olist          : require('./block/lists/olist'),
    OlItem         : require('./block/lists/olitem'),
    Dlist          : require('./block/lists/dlist'),
    DlItem         : require('./block/lists/dlitem'),
    Drawer         : require('./block/special/drawer'),
    Para           : require('./block/para')
  },
  inline: {
    Regular     : require('./inline/regular'),
    FootnoteRef : require('./inline/footnoteref')
  }
};

module.exports = exports = Org;