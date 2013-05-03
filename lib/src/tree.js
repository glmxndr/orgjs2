var _U = require('./utils');
var _  = require('lodash');

var TreeNode = function(org, parent){
  this.org        = org || {};
  this.conf       = this.org.conf || {};
  this.parent     = parent || null;
  this.id         = _U.id();
  this._children  = [];
};

TreeNode.prototype = {

  section: function () {
    var current = this.parent;
    while (current) {
      if (current.type === 'section') {
        return current;
      } else {
        current = current.parent;
      }
    }
  },

  ancestors: function(){
    var result = [];
    var parent = this.parent;
    while(parent !== null){
      result.push(parent);
      parent = parent.parent;
    }
    return result;
  },

  root: function(){
    var result = [];
    var parent = this.parent;
    while(parent !== null){
      result.push(parent);
      if(!parent.parent){return parent;}
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
    this._children.push(child);
    child.parent = this;
  },

  prepend: function(child){
    this._children.unshift(child);
    child.parent = this;
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