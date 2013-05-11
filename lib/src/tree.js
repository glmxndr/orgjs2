var _U = require('./utils');
var _  = _U._;

var TreeNode = function(parent){
  this.isTreeNode = true;
  this.parent     = parent || null;
  this.id         = _U.id();
  this.properties = {};
  this._children  = [];
};

TreeNode.prototype = {

  setProperties: function (obj) {
    _.assign(this.properties, obj);
    // TODO: treat the '+' suffix for property names to append to an 
    //       existing property 
  },

  rootOrg: function () {
    var doc = this.document();
    return (doc && doc.org) ? doc.org : new (require('./core'))();
  },

  config: function () {
    return this.rootOrg().config;
  },

  parseHeadline: function (line) {
    return this.rootOrg().parse.headline(line, this);
  },

  parseInline: function (txt, tp, tokens) {
    return this.rootOrg().parse.inline(txt, this, tp, tokens);
  },

  parseDocument: function (location) {
    return this.rootOrg().parseDocumentAt(location);
  },

  document: function () {     
    var current = this;
    while (current) {
      if (current.type === 'document') {
        return current;
      } else {
        current = current.parent;
      }
    }
  },

  section: function () {
    var current = this;
    while (current) {
      if (current.type === 'section' || current.type === 'document') {
        return current;
      } else {
        current = current.parent;
      }
    }
  },

  ancestors: function(){
    var result = [];
    var parent = this.parent;
    while (parent !== null) {
      result.push(parent);
      parent = parent.parent;
    }
    return result;
  },

  root: function(){
    var result = [];
    var parent = this;
    while (!!parent) {
      result.push(parent);
      if (!parent.parent) { return parent; }
      parent = parent.parent;
    }
    return parent;
  },

  children: function(){ return this._children; },

  leaf: function(){return this._children.length > 0;},
  
  siblings: function(){
    var all = this.siblingsAll(),
        id = this.id;
    return _.filter(all, function(v){return v.id !== id;});
  },
  
  siblingsAll: function(){
    return this.parent ? this.parent._children : [this];
  },

  prev: function(){
    var idx, candidate, prev = null;
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      candidate = siblings[idx];
      if(candidate.id === this.id){
        return prev;
      }
      prev = candidate;
    }
    return null;
  },
  
  prevAll: function(){
    var idx, candidate, result = [];
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      candidate = siblings[idx];
      if(candidate.id === this.id){
        return result;
      } else {
        result.push(candidate);
      }
    }
    return result;
  },
  
  next: function(){
    var idx, candidate, ok = false;
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      if(ok){return siblings[idx];}
      else {
        candidate = siblings[idx];
        if(candidate.id === this.id){
         ok = true;
        }
      }
    }
    return null;
  },
  
  nextAll: function(){
    var idx, candidate, ok = false, result = [];
    var siblings = this.siblingsAll();
    if(siblings.length == 1){return null;}
    for(idx in siblings){
      if(ok){result.push(siblings[idx]);}
      else {
        candidate = siblings[idx];
        if(candidate.id === this.id){
         ok = true;
        }
      }
    }
    return result;
  },

  append: function(child){
    if (_.isArray(child)) {
      _.each(child, _.bind(this.append, this));
    } else {
      this._children.push(child);
      child.parent = this;
    }
  },

  prepend: function(child){
    if (_.isArray(child)) {
      _.each(child, _.bind(this.prepend, this));
    } else {
      this._children.unshift(child);
      child.parent = this;
    }
  },

  replace: function(child, nodearr){
    var position = this._children.indexOf(child);
    var siblings = this._children;
    var result = [];
    result = result.concat(siblings.slice(0, position), nodearr, siblings.slice(position + 1));
    this._children = result;
  }

};

module.exports = exports = TreeNode;