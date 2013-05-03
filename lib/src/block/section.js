var _       = require('lodash');
var _U      = require('../utils');
var Block   = require('./block');
var Heading = require('./heading');
var Content = require('./content');
var Lines   = require('./lines');

var Section = function (org, parent) {
  Block.call(this, org, parent);
  this.type = "section";
};

Section.match = function (lines) {
  var line = _U.peak(lines);
  return !!(line && /^\*/.exec(line));
};

_U.extendProto(Section, Block, {
  /*accepts: function (lines) {
    // Do not acept more than one line
    if (this.heading) {return false;}
    return Section.match(lines);
  },*/
  consume: function (lines) {
    if (Section.match(lines)) {
      var line = lines.pop();
      this.heading = this.org.parse.heading(line);
      this.level = this.heading.level;
    } else {
      this.level = 0;
    }

    var contentLines = new Lines(lines.popUntil(Section.match));
    this.content = new Content(this.org, this);
    this.content.consume(contentLines);

    while (this.nextSectionIsChild(lines)) {
      var child = new Section(this.org, this);
      this.append(child);
      child.consume(lines);
    }

  },
  nextSectionIsChild: function (lines) {
    if (lines.length() === 0) {return false;}
    var line = lines.peak();
    var heading = this.org.parse.heading(line);
    var level = heading.level;
    return (level > this.level);
  }


});

module.exports = exports = Section;