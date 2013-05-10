var _U      = require('./utils');
var Block   = require('./block');
var Section = require('./block/section');
var Config  = require('./config');
var Lines   = require('./block/lines');

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {
    init: function (org) {
      this.footnotes = {
        number: 1,
        arr: []
      };
      this.org = org;
      delete this.parent;
      this.descendants = [];
    },
    declareFootnote: function (fndef) {
      var number = this.footnotes.num++;
      this.footnotes.arr[number] = fndef;
      fndef.number = number;
    }
  }
});

Document.includes = function (txt, basepath) {
  // TODO: treat includes.
  return txt;
};

Document.parser = function (org) {
  org = org || new (require('./core'))();
  var conf = org.conf || Config.defaults;
  var numspace = +conf.get('tabSize');
  var tabspace = _U.repeat(' ', numspace);
  return function (txt) {
    txt = txt.replace(/\t/g, tabspace);
    txt = Document.includes(txt);
    var d = new Document(org);
    d.consume(new Lines(txt));  
    return d;
  };
};

module.exports = exports = Document;