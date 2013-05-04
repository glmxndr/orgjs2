var _U       = require('./utils');
var Config   = require('./config');
var Heading  = require('./block/heading');

var Org = function (obj) {
  obj = obj || {};
  this.config = Config.prepare(obj);

  this.parse = {
    heading: Heading.parser(this.config)
  };

};

// Exposing components 
// (and forcing them to load, so that they can plug themselves).
Org.components = {
  Section       : require('./block/section'),
  Para          : require('./block/para'),
  Example       : require('./block/beginend/example'),
  Quote         : require('./block/beginend/quote'),
  Comment       : require('./block/beginend/comment'),
  Verse         : require('./block/beginend/verse'),
  Src           : require('./block/beginend/src'),
  CommentLine   : require('./block/special/commentline'),
  HorizontalRule: require('./block/special/hr'),
  Ulist         : require('./block/lists/ulist')
};

module.exports = exports = Org;