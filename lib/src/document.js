var _U      = require('./utils');
var Org     = require('./core');
var Block   = require('./block');
var Section = require('./section');
var Config  = require('./config');

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {}
});

Document.includes = function (txt, basepath) {
  // TODO: treat includes.
  return txt;
};

Document.parse = function (txt, org) {
  org = org || new Org();
  var numspace = +org.config.get('tabSize') || Config.defaults.tabSize;
  var tabspace = _U.repeat(' ', numspace);
  txt = txt.replace(/\t/g, tabspace);

  txt = Document.includes(txt);

  var d = new Document(org, null);
  d.consume(new Lines(txt));
};

module.exports = exports = Document;