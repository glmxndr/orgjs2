var _U       = require('./utils');
var Config   = require('./config');
var Heading  = require('./block/heading');
var Document = require('./block/document');


require('./block/para');
require('./block/lists/ulist');

var Org = function (obj) {
  obj = obj || {};
  this.config = Config.prepare(obj);

  this.parse = {
    heading: Heading.parser(this.config)
  };

};

module.exports = exports = Org;