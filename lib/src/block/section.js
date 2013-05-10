var _U = require('../utils');
var _  = _U._;

var Block    = require('../block');
var Content  = require('./content');

var Section = function (parent) {
  Block.call(this, parent);
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
    var headline = this.parseHeadline(line);
    var level = headline.level;
    return (level > this.level);
  },
  consume: function (lines) {
    if (Section.match(lines)) {
      var line = lines.pop();
      this.headline = this.parseHeadline(line);
      this.level = this.headline.level;
    } else {
      this.level = 0;
    }

    var contentLines = lines.popUntil(Section.match);
    this.content = new Content(this);
    this.content.consume(contentLines);

    while (this.accepts(lines)) {
      var child = new Section(this);
      this.append(child);
      child.consume(lines);
    }

  }
});

module.exports = exports = Section;