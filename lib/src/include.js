var _U    = require('./utils');
var Lines = require('./block/lines');

var Include = function (doc) {
  this.doc = doc;
  this.org = doc.org;
  this.config = doc.config();
  this.basePath = this.config.basePath;
};

Include.prototype = {
  rgxp: {
    includeLine: /^([^\S\n]*)#\+INCLUDE:\s*"([^"]+)"(?:\s+(example|quote|src)\b)?.*?$/mgi
  },
  replace: function (txt) {
    var include = this;
    return txt.replace(this.rgxp.includeLine, function (line, indent, url, beginend) {
      console.log(arguments);

      // Parsing the line and extracting the parameters
      var location = include.config.rewriteUrl(url);
      var match, srcType,
          prefix = '', prefix1 = '',
          minlevel,
          limit,
          limitMin = 0, limitMax = Infinity,
          limitNum;

      if (beginend === 'src') {
        srcType = (/\ssrc\s+([^:\s]+)/.exec(line) || [])[1];
      }

      match = line.match(/:prefix\s+"([^"]+)"/);
      if (match) { prefix   = match[1]; }
      match = line.match(/:prefix1\s+"([^"]+)"/);
      if (match) { prefix1  = match[1]; }
      match = line.match(/:minlevel\s+("?)(\d+)\1/);
      if (match) { minlevel = match[2]; }
      match = line.match(/:lines\s+"(\d*-\d*)"/);
      if (match) {
         limit = match[1];
        if (limit.match(/^\d*-\d*$/)) {
          limitNum = limit.match(/^\d+/);
          if (limitNum) {
             limitMin = +(limitNum[0]) - 1;
          }
          limitNum =  limit.match(/\d+$/);
          if (limitNum) {
             limitMax = +(limitNum[0]);
          }
        }
      }

      // Loading the content
      var content = _U.load(location);

      // Modifying the headlines levels (if =:minlevel= has been set)
      if(minlevel && !beginend){
        var minfound = 1000;
        var headlineRgx = /^\*+(?=\s)/mg;
        var foundstars = content.match(headlineRgx);
        _U.each(foundstars, function (v) {
          minfound = Math.min(minfound, v.length);
        });
        if(minlevel > minfound){
          var starsToAppend = _U.repeat("*", minlevel - minfound);
          content = content.replace(headlineRgx, function(m){
            return starsToAppend + m;
          });
        }
      }

      // Generating the included content from the fetched lines
      var lines = content.split(/\r?\n/g);
      var result = [];
      var first = true;

      _.each(lines, function (v, idx) {
        if (idx < limitMin || idx > limitMax + 1) { return false; }
        var line = (beginend ? indent : '') + (first ? (prefix1 ? prefix1 : prefix) : prefix) + v;
        result.push(line);
        first = false;
      });

      result = result.join('\n');

      // Enclosing in a =BEGIN/END= block if needed
      if (beginend === 'src') {
        var begin = indent + '#+BEGIN_SRC ';
        if(srcType){begin += srcType + ' ';}
        begin += '\n';
        result = begin + 
                 result.replace(/#\+END_SRC/ig, '\\#+END_SRC') + 
                 '\n' + indent + '#+END_SRC\n';
      } else if(beginend === 'example'){
        result = indent + '#+BEGIN_EXAMPLE \n' + 
                 result.replace(/#\+END_EXAMPLE/ig, '\\#+END_EXAMPLE') + 
                 '\n' + indent + '#+END_EXAMPLE\n';
      } else if(beginend === 'quote'){
        result = indent + '#+BEGIN_QUOTE \n' + 
                 result.replace(/#\+END_QUOTE/ig, '\\#+END_QUOTE') + 
                 '\n' + indent + '#+END_QUOTE\n';
      }

      return result;

    });
  }
};

module.exports = exports = Include;