require('../shim');
var TreeNode = require('../tree');


var Document = function (params) {
  // A document is the root element of a tree
  TreeNode.apply(this, [null, params]);
  this.properties = {};
  this.footnotes = {};
  
};

module.exports = exports = Document;