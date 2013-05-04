var _       = require('lodash');
var _U      = require('../utils');
var Block   = require('./block');
var Heading = require('./heading');
var Content = require('./content');

var Section = function (org, parent) {
  Block.call(this, org, parent);
  this.type = "section";
};

Section.match = function (lines) {
  var line = _U.peak(lines);
  return !!(line && /^\*/.exec(line));
};

_U.extendProto(Section, Block, {
  accepts: function (lines) {
    if (lines.length() === 0) {return false;}
    var line = lines.peak();
    var heading = this.org.parse.heading(line);
    var level = heading.level;
    return (level > this.level);
  },
  consume: function (lines) {
    if (Section.match(lines)) {
      var line = lines.pop();
      this.heading = this.org.parse.heading(line);
      this.level = this.heading.level;
    } else {
      this.level = 0;
    }

    var contentLines = lines.popUntil(Section.match);
    this.content = new Content(this.org, this);
    this.content.consume(contentLines);

    while (this.accepts(lines)) {
      var child = new Section(this.org, this);
      this.append(child);
      child.consume(lines);
    }

  }
});

module.exports = exports = Section;