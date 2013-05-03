var _U = require('../utils');

var Heading = function (matcher) {
  this.stars = matcher[1];
  this.level = this.stars.length;
  this.todo  = matcher[2];
  this.priority = matcher[3];
  this.title = matcher[4];
  this.tags = matcher[5] ? matcher[5].split(/:/) : [];
};

Heading.parser = function (conf) {
  var todos = conf.headingTodos;
  var priorities = conf.headingPriorities;

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

  return function (line) {
    var matcher = rgxp.exec(line);
    return matcher ? new Heading(matcher) : null;
  };
};

module.exports = exports = Heading;