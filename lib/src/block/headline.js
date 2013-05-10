var _U     = require('../utils');
var Config = require('../config');
var Org    = require('../core');
var Block  = require('../block');

var Headline = Block.define({
  type: 'headline',
  methods: {
    make: function (m) {
      this.raw      = m[0];
      this.stars    = m[1];
      this.level    = this.stars.length;
      this.todo     = m[2];
      this.priority = m[3];
      this.title    = this.parseInline(m[4]);
      this.tags     = m[5] ? m[5].split(/:/) : [];
      return this;
    }
  }
});

Headline.parser = function (org) {
  org = org || new Org();
  var config = org.config || Config.defaults;
  
  var todos = config.headlineTodos;
  var priorities = config.headlinePriorities;

  // Build the regexp
  var str = "(\\**)%s+";
  str += "(?:(%TODOS)%s+)?";
  str += "(?:\\[\\#(%PRIORITIES)\\]%s+)?";
  str += "(.*?)%s*";
  str += "(?:%s+:([A-Za-z0-9:]+):%s*)?";
  str += "(?:\n|$)";

  str = str.replace(/%TODOS/, todos.join('|'));
  str = str.replace(/%PRIORITIES/, priorities.join('|'));
  str = str.replace(/%s/g, '[ \\t]');

  var rgxp = RegExp(str);

  return function (line, parent) {
    var matcher = rgxp.exec(line);
    return matcher ? new Headline(parent).make(matcher) : null;
  };
};

module.exports = exports = Headline;