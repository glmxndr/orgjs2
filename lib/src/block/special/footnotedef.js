var _U    = require('../../utils');
var Block = require('../block');

var fndefRgxp = /^(\s*)\[(\d+|fn:.+?)\]\s*/;

var FootnoteDef = Block.define({
  parent: Block,
  type: 'fndef',
  registerLevel: 'medium',
  match: function (lines, parent) {
    return _U.peak(lines).match(fndefRgxp);
  },
  methods: {
    accepts: function (lines) {
      var line = lines.peak();
      var indent = _U.indentLevel(line);
      return indent >= this.indent;
    },
    prepare: function (lines) {
      var line = lines.pop();
      // Register the footnote in the current document.
      var m = line.match(fndefRgxp);
      this.name = m[2];
      this.document().declareFootnote(this);
      // Remove the footnote declaration to allow sub-nodes parsing.
      line = line.replace(fndefRgxp, '$1');
      lines.push(line);
    },
    consume: function (lines) {
      var line = lines.peak();
      this.indent = _U.indentLevel(line);
      this.prepare(lines);
      var linebreak = 0;
      do {
        var next = new (Block.get(lines))(this.org, this);
        this.append(next);
        next.consume(lines);
        linebreak = lines.trimBlank().length();
      } while (linebreak === 0 && this.accepts(lines));
    }
  }
});


  var FndefBlock = function(parent){
    ContentMarkupBlock.call(this, parent, "FndefBlock");
    this.indent = parent.indent || 0;
    this.firstline = true;
  };
  LineDef.FNDEF = {
    id:     "FNDEF",
    rgx:    RLT.fndef,
    constr: FndefBlock
  };
  Content.FndefBlock = FndefBlock;
  FndefBlock.prototype = Object.create(ContentMarkupBlock.prototype);
  FndefBlock.prototype.accept = function(line, type){
    var indent;
    if(type === LineDef.FNDEF.id){
      if(this.ended){return false;}
      return true;
    }
    if(type === LineDef.BLANK.id){
      if(this.ended){ return true; }
      this.ended = true; return true;
    }
    if(this.ended){ return false; }
    return true;
  };
  FndefBlock.prototype.consume = function(line, type){
    if(this.firstline){
      this.name = /^\s*\[(.*?)\]/.exec(line)[1].replace(/^fn:/, '');
      this.firstline = false;
    }
    if(type !== LineDef.IGNORED.id){
      this.lines.push(line);
    }
    return this;
  };
  FndefBlock.prototype.finalize = function(line){
    var root = this.root();
    var content = this.lines.join("\n");
    content = content.replace(/^(\s*)\[.*?\]/, "$1");
    var inline = OM.parse(this, content);
    root.addFootnoteDef(inline, this.name);
  };



module.exports = exports = FootnoteDef;