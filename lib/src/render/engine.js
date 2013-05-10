var _U       = require('../utils');
var _        = _U._;
var JSONPath = _U.dependency('JSONPath', 'jsonPath');
var TreeNode = require('../tree');

var RenderEngine = function (obj) {
  obj = obj || {};
  var defaults = obj.defaults || {};
  this.matchers = _.defaults(defaults, obj.matchers);
};

var empty = function () { return ''; };

RenderEngine.prototype = {
  getRenderer: function (node) {
    var renderFn = this.matchers[node.type] || empty;
    return _.bind(renderFn, node);
  },
  render: function (doc) {
    var engine = this;
    var render = function renderCb (node) {
      if (node === null || node === void 0) {
        _U.log.error('Ignoring render for wrong value', node);
        return '';
      }
      else if (_.isArray(node)) {
        return _U.join.apply(engine, _.map(node, render));
      } else if (node.isTreeNode) {
        return engine.getRenderer(node)(render, node);
      } else {
        _U.log.info('Rendering non-treenode object', '' + node);
        return '' + node;
      }
    };

    return engine.getRenderer(doc)(render, doc);
  }
};

module.exports = exports = RenderEngine;
