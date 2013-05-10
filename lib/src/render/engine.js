var _U       = require('../utils');
var _        = _U._;
var JSONPath = _U.dependency('JSONPath', 'jsonPath');
var TreeNode = require('../tree');

var RenderEngine = function (obj) {
  obj = obj || {};
  this.defaults = obj.defaults;
  this.matchers = obj.matchers;
};

RenderEngine.prototype = {
  alias: function (s) {
    return s === 'p' ? 'para'
         : s === 'r' ? 'regular'
         : s === 'i' ? 'emphasis'
         : s === 'b' ? 'strong'
         : s === 'u' ? 'underline'
         : s === 's' ? 'strike'
         : s === 'h' ? 'headline'
         : s === 'li' ? '[uo]litem' 
         : s === 'uli' ? 'ulitem'
         : s === 'oli' ? 'olitem'
         : s === 'dli' ? 'dlitem'
         : s;
  },
  transformPath: function (orgpath) {
    var engine = this;
    return '$..' + orgpath.replace(/[a-z]+/g, function (type) {
      return '*[?(@.type && @.type.match(/' +  engine.alias(type) + '/))]';
    });
  },
  assignRenderers: function (doc, matchers, store) {
    var engine = this;
    var nodes  = [doc].concat(doc.descendants);
    _.each(nodes, function (n) {
      var renderFn = matchers[n.type];
      if (renderFn) {
        store[n.id] = _.bind(renderFn, n);
      }
    });

  },
  render: function (doc) {
    var store = {};
    var render = function renderCb (node) {
      if (node === null || node === void 0) {
        _U.log.error('Rendering wrong value', node);
        return "";
      }
      else if (_.isArray(node)) {
        console.log(node);
        return _U.join.apply(this, _.map(node, render));
      } else if (node.isTreeNode) {
        var errorFn = function (r,n) {
          _U.log.error('No renderer found for node', n);
          return n;
        };
        return (store[node.id] || errorFn)(render, node);
      } else {
        _U.log.error('Rendering non-treenode object', node, "" + node);
        return "" + node;
      }
    };

    if (this.defaults) {
      this.assignRenderers(doc, this.defaults, store);
    }
    this.assignRenderers(doc, this.matchers, store);

    return store[doc.id](render, doc);
  }
};

module.exports = exports = RenderEngine;
