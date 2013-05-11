var _U     = require('../utils');
var Inline = require('../inline');

var Entity = Inline.define({
  type: 'entity',
  replace: function (txt, parent, tp, tokens) {
    txt = txt.replace(/\\([a-z]+\d*)\b/g, function (m, e) {
      if (!Entity.store[e]) { return m; }
      var entity     = new Entity(parent);
      entity.raw     = m;
      entity.content = Entity.store[e];
      token          = _U.newToken(tp);
      tokens[token]  = entity;
      return token;
    });
    return txt;
  }
});

Entity.store = {};

var define = function () {
  var a = arguments;
  Entity.store[a[0]] = {
    latex : a[1],
    html  : a[2],
    ascii : a[3],
    latin1: a[4],
    utf8  : a[5]
  };
};

//    "* Letters"
//    "** Latin"
define("Agrave","\\`{A}","&Agrave;","A","À","À");
define("agrave","\\`{a}","&agrave;","a","à","à");
define("Aacute","\\'{A}","&Aacute;","A","Á","Á");
define("aacute","\\'{a}","&aacute;","a","á","á");
define("Acirc","\\^{A}","&Acirc;","A","Â","Â");
define("acirc","\\^{a}","&acirc;","a","â","â");
define("Atilde","\\~{A}","&Atilde;","A","Ã","Ã");
define("atilde","\\~{a}","&atilde;","a","ã","ã");
define("Auml","\\\"{A}","&Auml;","Ae","Ä","Ä");
define("auml","\\\"{a}","&auml;","ae","ä","ä");
define("Aring","\\AA{}","&Aring;","A","Å","Å");
define("AA","\\AA{}","&Aring;","A","Å","Å");
define("aring","\\aa{}","&aring;","a","å","å");
define("AElig","\\AE{}","&AElig;","AE","Æ","Æ");
define("aelig","\\ae{}","&aelig;","ae","æ","æ");
define("Ccedil","\\c{C}","&Ccedil;","C","Ç","Ç");
define("ccedil","\\c{c}","&ccedil;","c","ç","ç");
define("Egrave","\\`{E}","&Egrave;","E","È","È");
define("egrave","\\`{e}","&egrave;","e","è","è");
define("Eacute","\\'{E}","&Eacute;","E","É","É");
define("eacute","\\'{e}","&eacute;","e","é","é");
define("Ecirc","\\^{E}","&Ecirc;","E","Ê","Ê");
define("ecirc","\\^{e}","&ecirc;","e","ê","ê");
define("Euml","\\\"{E}","&Euml;","E","Ë","Ë");
define("euml","\\\"{e}","&euml;","e","ë","ë");
define("Igrave","\\`{I}","&Igrave;","I","Ì","Ì");
define("igrave","\\`{i}","&igrave;","i","ì","ì");
define("Iacute","\\'{I}","&Iacute;","I","Í","Í");
define("iacute","\\'{i}","&iacute;","i","í","í");
define("Icirc","\\^{I}","&Icirc;","I","Î","Î");
define("icirc","\\^{i}","&icirc;","i","î","î");
define("Iuml","\\\"{I}","&Iuml;","I","Ï","Ï");
define("iuml","\\\"{i}","&iuml;","i","ï","ï");
define("Ntilde","\\~{N}","&Ntilde;","N","Ñ","Ñ");
define("ntilde","\\~{n}","&ntilde;","n","ñ","ñ");
define("Ograve","\\`{O}","&Ograve;","O","Ò","Ò");
define("ograve","\\`{o}","&ograve;","o","ò","ò");
define("Oacute","\\'{O}","&Oacute;","O","Ó","Ó");
define("oacute","\\'{o}","&oacute;","o","ó","ó");
define("Ocirc","\\^{O}","&Ocirc;","O","Ô","Ô");
define("ocirc","\\^{o}","&ocirc;","o","ô","ô");
define("Otilde","\\~{O}","&Otilde;","O","Õ","Õ");
define("otilde","\\~{o}","&otilde;","o","õ","õ");
define("Ouml","\\\"{O}","&Ouml;","Oe","Ö","Ö");
define("ouml","\\\"{o}","&ouml;","oe","ö","ö");
define("Oslash","\\O","&Oslash;","O","Ø","Ø");
define("oslash","\\o{}","&oslash;","o","ø","ø");
define("OElig","\\OE{}","&OElig;","OE","OE","Œ");
define("oelig","\\oe{}","&oelig;","oe","oe","œ");
define("Scaron","\\v{S}","&Scaron;","S","S","Š");
define("scaron","\\v{s}","&scaron;","s","s","š");
define("szlig","\\ss{}","&szlig;","ss","ß","ß");
define("Ugrave","\\`{U}","&Ugrave;","U","Ù","Ù");
define("ugrave","\\`{u}","&ugrave;","u","ù","ù");
define("Uacute","\\'{U}","&Uacute;","U","Ú","Ú");
define("uacute","\\'{u}","&uacute;","u","ú","ú");
define("Ucirc","\\^{U}","&Ucirc;","U","Û","Û");
define("ucirc","\\^{u}","&ucirc;","u","û","û");
define("Uuml","\\\"{U}","&Uuml;","Ue","Ü","Ü");
define("uuml","\\\"{u}","&uuml;","ue","ü","ü");
define("Yacute","\\'{Y}","&Yacute;","Y","Ý","Ý");
define("yacute","\\'{y}","&yacute;","y","ý","ý");
define("Yuml","\\\"{Y}","&Yuml;","Y","Y","Ÿ");
define("yuml","\\\"{y}","&yuml;","y","ÿ","ÿ");

//    "** Latin (special face)"
define("fnof","\\textit{f}","&fnof;","f","f","ƒ");
define("real","\\Re","&real;","R","R","ℜ");
define("image","\\Im","&image;","I","I","ℑ");
define("weierp","\\wp","&weierp;","P","P","℘");

//    "** Greek"
define("Alpha","A","&Alpha;","Alpha","Alpha","Α");
define("alpha","\\alpha","&alpha;","alpha","alpha","α");
define("Beta","B","&Beta;","Beta","Beta","Β");
define("beta","\\beta","&beta;","beta","beta","β");
define("Gamma","\\Gamma","&Gamma;","Gamma","Gamma","Γ");
define("gamma","\\gamma","&gamma;","gamma","gamma","γ");
define("Delta","\\Delta","&Delta;","Delta","Gamma","Δ");
define("delta","\\delta","&delta;","delta","delta","δ");
define("Epsilon","E","&Epsilon;","Epsilon","Epsilon","Ε");
define("epsilon","\\epsilon","&epsilon;","epsilon","epsilon","ε");
define("varepsilon","\\varepsilon","&epsilon;","varepsilon","varepsilon","ε");
define("Zeta","Z","&Zeta;","Zeta","Zeta","Ζ");
define("zeta","\\zeta","&zeta;","zeta","zeta","ζ");
define("Eta","H","&Eta;","Eta","Eta","Η");
define("eta","\\eta","&eta;","eta","eta","η");
define("Theta","\\Theta","&Theta;","Theta","Theta","Θ");
define("theta","\\theta","&theta;","theta","theta","θ");
define("thetasym","\\vartheta","&thetasym;","theta","theta","ϑ");
define("vartheta","\\vartheta","&thetasym;","theta","theta","ϑ");
define("Iota","I","&Iota;","Iota","Iota","Ι");
define("iota","\\iota","&iota;","iota","iota","ι");
define("Kappa","K","&Kappa;","Kappa","Kappa","Κ");
define("kappa","\\kappa","&kappa;","kappa","kappa","κ");
define("Lambda","\\Lambda","&Lambda;","Lambda","Lambda","Λ");
define("lambda","\\lambda","&lambda;","lambda","lambda","λ");
define("Mu","M","&Mu;","Mu","Mu","Μ");
define("mu","\\mu","&mu;","mu","mu","μ");
define("nu","\\nu","&nu;","nu","nu","ν");
define("Nu","N","&Nu;","Nu","Nu","Ν");
define("Xi","\\Xi","&Xi;","Xi","Xi","Ξ");
define("xi","\\xi","&xi;","xi","xi","ξ");
define("Omicron","O","&Omicron;","Omicron","Omicron","Ο");
define("omicron","\\textit{o}","&omicron;","omicron","omicron","ο");
define("Pi","\\Pi","&Pi;","Pi","Pi","Π");
define("pi","\\pi","&pi;","pi","pi","π");
define("Rho","P","&Rho;","Rho","Rho","Ρ");
define("rho","\\rho","&rho;","rho","rho","ρ");
define("Sigma","\\Sigma","&Sigma;","Sigma","Sigma","Σ");
define("sigma","\\sigma","&sigma;","sigma","sigma","σ");
define("sigmaf","\\varsigma","&sigmaf;","sigmaf","sigmaf","ς");
define("varsigma","\\varsigma","&sigmaf;","varsigma","varsigma","ς");
define("Tau","T","&Tau;","Tau","Tau","Τ");
define("Upsilon","\\Upsilon","&Upsilon;","Upsilon","Upsilon","Υ");
define("upsih","\\Upsilon","&upsih;","upsilon","upsilon","ϒ");
define("upsilon","\\upsilon","&upsilon;","upsilon","upsilon","υ");
define("Phi","\\Phi","&Phi;","Phi","Phi","Φ");
define("phi","\\phi","&phi;","phi","phi","φ");
define("Chi","X","&Chi;","Chi","Chi","Χ");
define("chi","\\chi","&chi;","chi","chi","χ");
define("acutex","\\acute x","&acute;x","'x","'x","𝑥́");
define("Psi","\\Psi","&Psi;","Psi","Psi","Ψ");
define("psi","\\psi","&psi;","psi","psi","ψ");
define("tau","\\tau","&tau;","tau","tau","τ");
define("Omega","\\Omega","&Omega;","Omega","Omega","Ω");
define("omega","\\omega","&omega;","omega","omega","ω");
define("piv","\\varpi","&piv;","omega-pi","omega-pi","ϖ");
define("partial","\\partial","&part;","[partial differential]","[partial differential]","∂");

//    "** Hebrew"
define("alefsym","\\aleph","&alefsym;","aleph","aleph","ℵ");

//    "** Dead languages"
define("ETH","\\DH{}","&ETH;","D","Ð","Ð");
define("eth","\\dh{}","&eth;","dh","ð","ð");
define("THORN","\\TH{}","&THORN;","TH","Þ","Þ");
define("thorn","\\th{}","&thorn;","th","þ","þ");

//    "* Punctuation"
//    "** Dots and Marks"
define("dots","\\dots{}","&hellip;","...","...","…");
define("hellip","\\dots{}","&hellip;","...","...","…");
define("middot","\\textperiodcentered{}","&middot;",".","·","·");
define("iexcl","!`","&iexcl;","!","¡","¡");
define("iquest","?`","&iquest;","?","¿","¿");

//    "** Dash-like"
define("shy","\\-","&shy;","","","");
define("ndash","--","&ndash;","-","-","–");
define("mdash","---","&mdash;","--","--","—");

//    "** Quotations"
define("quot","\\textquotedbl{}","&quot;","\"","\"","\"");
define("acute","\\textasciiacute{}","&acute;","'","´","´");
define("ldquo","\\textquotedblleft{}","&ldquo;","\"","\"","“");
define("rdquo","\\textquotedblright{}","&rdquo;","\"","\"","”");
define("bdquo","\\quotedblbase{}","&bdquo;","\"","\"","„");
define("lsquo","\\textquoteleft{}","&lsquo;","`","`","‘");
define("rsquo","\\textquoteright{}","&rsquo;","'","'","’");
define("sbquo","\\quotesinglbase{}","&sbquo;",",",",","‚");
define("laquo","\\guillemotleft{}","&laquo;","<<","«","«");
define("raquo","\\guillemotright{}","&raquo;",">>","»","»");
define("lsaquo","\\guilsinglleft{}","&lsaquo;","<","<","‹");
define("rsaquo","\\guilsinglright{}","&rsaquo;",">",">","›");

//    "* Other"
//    "** Misc. (often used)"
define("circ","\\circ","&circ;","^","^","ˆ");
define("vert","\\vert{}","&#124;",",",",",",");
define("brvbar","\\textbrokenbar{}","&brvbar;",",","¦","¦");
define("sect","\\S","&sect;","paragraph","§","§");
define("amp","\\&","&amp;","&","&","&");
define("lt","\\textless{}","&lt;","<","<","<");
define("gt","\\textgreater{}","&gt;",">",">",">");
define("tilde","\\~{}","&tilde;","~","~","~");
define("dagger","\\textdagger{}","&dagger;","[dagger]","[dagger]","†");
define("Dagger","\\textdaggerdbl{}","&Dagger;","[doubledagger]","[doubledagger]","‡");

//    "** Whitespace"
define("nbsp","~","&nbsp;"," "," "," ");
define("ensp","\\hspace*{.5em}","&ensp;"," "," "," ");
define("emsp","\\hspace*{1em}","&emsp;"," "," "," ");
define("thinsp","\\hspace*{.2em}","&thinsp;"," "," "," ");

//    "** Currency"
define("curren","\\textcurrency{}","&curren;","curr.","¤","¤");
define("cent","\\textcent{}","&cent;","cent","¢","¢");
define("pound","\\pounds{}","&pound;","pound","£","£");
define("yen","\\textyen{}","&yen;","yen","¥","¥");
define("euro","\\texteuro{}","&euro;","EUR","EUR","€");
define("EUR","\\EUR{}","&euro;","EUR","EUR","€");
define("EURdig","\\EURdig{}","&euro;","EUR","EUR","€");
define("EURhv","\\EURhv{}","&euro;","EUR","EUR","€");
define("EURcr","\\EURcr{}","&euro;","EUR","EUR","€");
define("EURtm","\\EURtm{}","&euro;","EUR","EUR","€");

//    "** Property Marks"
define("copy","\\textcopyright{}","&copy;","(c)","©","©");
define("reg","\\textregistered{}","&reg;","(r)","®","®");
define("trade","\\texttrademark{}","&trade;","TM","TM","™");

//    "** Science et al."
define("minus","\\minus","&minus;","-","-","−");
define("pm","\\textpm{}","&plusmn;","+-","±","±");
define("plusmn","\\textpm{}","&plusmn;","+-","±","±");
define("times","\\texttimes{}","&times;","*","×","×");
define("frasl","/","&frasl;","/","/","⁄");
define("div","\\textdiv{}","&divide;","/","÷","÷");
define("frac12","\\textonehalf{}","&frac12;","1/2","½","½");
define("frac14","\\textonequarter{}","&frac14;","1/4","¼","¼");
define("frac34","\\textthreequarters{}","&frac34;","3/4","¾","¾");
define("permil","\\textperthousand{}","&permil;","per thousand","per thousand","‰");
define("sup1","\\textonesuperior{}","&sup1;","^1","¹","¹");
define("sup2","\\texttwosuperior{}","&sup2;","^2","²","²");
define("sup3","\\textthreesuperior{}","&sup3;","^3","³","³");
define("radic","\\sqrt{\\,}","&radic;","[square root]","[square root]","√");
define("sum","\\sum","&sum;","[sum]","[sum]","∑");
define("prod","\\prod","&prod;","[product]","[n-ary product]","∏");
define("micro","\\textmu{}","&micro;","micro","µ","µ");
define("macr","\\textasciimacron{}","&macr;","[macron]","¯","¯");
define("deg","\\textdegree{}","&deg;","degree","°","°");
define("prime","\\prime","&prime;","'","'","′");
define("Prime","\\prime{}\\prime","&Prime;","''","''","″");
define("infin","\\propto","&infin;","[infinity]","[infinity]","∞");
define("infty","\\infty","&infin;","[infinity]","[infinity]","∞");
define("prop","\\propto","&prop;","[proportional to]","[proportional to]","∝");
define("proptp","\\propto","&prop;","[proportional to]","[proportional to]","∝");
define("not","\\textlnot{}","&not;","[angled dash]","¬","¬");
define("land","\\land","&and;","[logical and]","[logical and]","∧");
define("wedge","\\wedge","&and;","[logical and]","[logical and]","∧");
define("lor","\\lor","&or;","[logical or]","[logical or]","∨");
define("vee","\\vee","&or;","[logical or]","[logical or]","∨");
define("cap","\\cap","&cap;","[intersection]","[intersection]","∩");
define("cup","\\cup","&cup;","[union]","[union]","∪");
define("int","\\int","&int;","[integral]","[integral]","∫");
define("there4","\\therefore","&there4;","[therefore]","[therefore]","∴");
define("sim","\\sim","&sim;","~","~","∼");
define("cong","\\cong","&cong;","[approx. equal to]","[approx. equal to]","≅");
define("simeq","\\simeq","&cong;","[approx. equal to]","[approx. equal to]","≅");
define("asymp","\\asymp","&asymp;","[almost equal to]","[almost equal to]","≈");
define("approx","\\approx","&asymp;","[almost equal to]","[almost equal to]","≈");
define("ne","\\ne","&ne;","[not equal to]","[not equal to]","≠");
define("neq","\\neq","&ne;","[not equal to]","[not equal to]","≠");
define("equiv","\\equiv","&equiv;","[identical to]","[identical to]","≡");
define("le","\\le","&le;","<=","<=","≤");
define("ge","\\ge","&ge;",">=",">=","≥");
define("sub","\\subset","&sub;","[subset of]","[subset of]","⊂");
define("subset","\\subset","&sub;","[subset of]","[subset of]","⊂");
define("sup","\\supset","&sup;","[superset of]","[superset of]","⊃");
define("supset","\\supset","&sup;","[superset of]","[superset of]","⊃");
define("nsub","\\not\\subset","&nsub;","[not a subset of]","[not a subset of","⊄");
define("sube","\\subseteq","&sube;","[subset of or equal to]","[subset of or equal to]","⊆");
define("nsup","\\not\\supset","&nsup;","[not a superset of]","[not a superset of]","⊅");
define("supe","\\supseteq","&supe;","[superset of or equal to]","[superset of or equal to]","⊇");
define("forall","\\forall","&forall;","[for all]","[for all]","∀");
define("exist","\\exists","&exist;","[there exists]","[there exists]","∃");
define("exists","\\exists","&exist;","[there exists]","[there exists]","∃");
define("empty","\\empty","&empty;","[empty set]","[empty set]","∅");
define("emptyset","\\emptyset","&empty;","[empty set]","[empty set]","∅");
define("isin","\\in","&isin;","[element of]","[element of]","∈");
define("in","\\in","&isin;","[element of]","[element of]","∈");
define("notin","\\notin","&notin;","[not an element of]","[not an element of]","∉");
define("ni","\\ni","&ni;","[contains as member]","[contains as member]","∋");
define("nabla","\\nabla","&nabla;","[nabla]","[nabla]","∇");
define("ang","\\angle","&ang;","[angle]","[angle]","∠");
define("angle","\\angle","&ang;","[angle]","[angle]","∠");
define("perp","\\perp","&perp;","[up tack]","[up tack]","⊥");
define("sdot","\\cdot","&sdot;","[dot]","[dot]","⋅");
define("cdot","\\cdot","&sdot;","[dot]","[dot]","⋅");
define("lceil","\\lceil","&lceil;","[left ceiling]","[left ceiling]","⌈");
define("rceil","\\rceil","&rceil;","[right ceiling]","[right ceiling]","⌉");
define("lfloor","\\lfloor","&lfloor;","[left floor]","[left floor]","⌊");
define("rfloor","\\rfloor","&rfloor;","[right floor]","[right floor]","⌋");
define("lang","\\langle","&lang;","<","<","⟨");
define("rang","\\rangle","&rang;",">",">","⟩");

//    "** Arrows"
define("larr","\\leftarrow","&larr;","<-","<-","←");
define("leftarrow","\\leftarrow","&larr;","<-","<-","←");
define("gets","\\gets","&larr;","<-","<-","←");
define("lArr","\\Leftarrow","&lArr;","<=","<=","⇐");
define("Leftarrow","\\Leftarrow","&lArr;","<=","<=","⇐");
define("uarr","\\uparrow","&uarr;","[uparrow]","[uparrow]","↑");
define("uparrow","\\uparrow","&uarr;","[uparrow]","[uparrow]","↑");
define("uArr","\\Uparrow","&uArr;","[dbluparrow]","[dbluparrow]","⇑");
define("Uparrow","\\Uparrow","&uArr;","[dbluparrow]","[dbluparrow]","⇑");
define("rarr","\\rightarrow","&rarr;","->","->","→");
define("to","\\to","&rarr;","->","->","→");
define("rightarrow","\\rightarrow","&rarr;","->","->","→");
define("rArr","\\Rightarrow","&rArr;","=>","=>","⇒");
define("Rightarrow","\\Rightarrow","&rArr;","=>","=>","⇒");
define("darr","\\downarrow","&darr;","[downarrow]","[downarrow]","↓");
define("downarrow","\\downarrow","&darr;","[downarrow]","[downarrow]","↓");
define("dArr","\\Downarrow","&dArr;","[dbldownarrow]","[dbldownarrow]","⇓");
define("Downarrow","\\Downarrow","&dArr;","[dbldownarrow]","[dbldownarrow]","⇓");
define("harr","\\leftrightarrow","&harr;","<->","<->","↔");
define("leftrightarrow","\\leftrightarrow","&harr;","<->","<->","↔");
define("hArr","\\Leftrightarrow","&hArr;","<=>","<=>","⇔");
define("Leftrightarrow","\\Leftrightarrow","&hArr;","<=>","<=>","⇔");
define("crarr","\\hookleftarrow","&crarr;","<-'","<-'","↵");
define("hookleftarrow","\\hookleftarrow","&crarr;","<-'","<-'","↵");

//    "** Function names"
define("arccos","\\arccos","arccos","arccos","arccos","arccos");
define("arcsin","\\arcsin","arcsin","arcsin","arcsin","arcsin");
define("arctan","\\arctan","arctan","arctan","arctan","arctan");
define("arg","\\arg","arg","arg","arg","arg");
define("cos","\\cos","cos","cos","cos","cos");
define("cosh","\\cosh","cosh","cosh","cosh","cosh");
define("cot","\\cot","cot","cot","cot","cot");
define("coth","\\coth","coth","coth","coth","coth");
define("csc","\\csc","csc","csc","csc","csc");
define("deg","\\deg","&deg;","deg","deg","deg");
define("det","\\det","det","det","det","det");
define("dim","\\dim","dim","dim","dim","dim");
define("exp","\\exp","exp","exp","exp","exp");
define("gcd","\\gcd","gcd","gcd","gcd","gcd");
define("hom","\\hom","hom","hom","hom","hom");
define("inf","\\inf","inf","inf","inf","inf");
define("ker","\\ker","ker","ker","ker","ker");
define("lg","\\lg","lg","lg","lg","lg");
define("lim","\\lim","lim","lim","lim","lim");
define("liminf","\\liminf","liminf","liminf","liminf","liminf");
define("limsup","\\limsup","limsup","limsup","limsup","limsup");
define("ln","\\ln","ln","ln","ln","ln");
define("log","\\log","log","log","log","log");
define("max","\\max","max","max","max","max");
define("min","\\min","min","min","min","min");
define("Pr","\\Pr","Pr","Pr","Pr","Pr");
define("sec","\\sec","sec","sec","sec","sec");
define("sin","\\sin","sin","sin","sin","sin");
define("sinh","\\sinh","sinh","sinh","sinh","sinh");
define("sup","\\sup","&sup;","sup","sup","sup");
define("tan","\\tan","tan","tan","tan","tan");
define("tanh","\\tanh","tanh","tanh","tanh","tanh");

//    "** Signs & Symbols"
define("bull","\\textbullet{}","&bull;","*","*","•");
define("bullet","\\textbullet{}","&bull;","*","*","•");
define("star","\\star","*","*","*","⋆");
define("lowast","\\ast","&lowast;","*","*","∗");
define("ast","\\ast","&lowast;","*","*","*");
define("odot","\\odot","o","[circled dot]","[circled dot]","ʘ");
define("oplus","\\oplus","&oplus;","[circled plus]","[circled plus]","⊕");
define("otimes","\\otimes","&otimes;","[circled times]","[circled times]","⊗");
define("checkmark","\\checkmark","&#10003;","[checkmark]","[checkmark]","✓");

//    "** Miscellaneous (seldom used)"
define("para","\\P{}","&para;","[pilcrow]","¶","¶");
define("ordf","\\textordfeminine{}","&ordf;","_a_","ª","ª");
define("ordm","\\textordmasculine{}","&ordm;","_o_","º","º");
define("cedil","\\c{}","&cedil;","[cedilla]","¸","¸");
define("oline","\\overline{~}","&oline;","[overline]","¯","‾");
define("uml","\\textasciidieresis{}","&uml;","[diaeresis]","¨","¨");
define("zwnj","\\/{}","&zwnj;","","","");
define("zwj","","&zwj;","","","");
define("lrm","","&lrm;","","","");
define("rlm","","&rlm;","","","");

//    "** Smilies"
define("smile","\\smile","&#9786;",":-)",":-)","⌣");
define("smiley","\\smiley{}","&#9786;",":-)",":-)","☺");
define("blacksmile","\\blacksmiley{}","&#9787;",":-)",":-)","☻");
define("sad","\\frownie{}","&#9785;",":-(",":-(","☹");

//    "** Suits"
define("clubs","\\clubsuit","&clubs;","[clubs]","[clubs]","♣");
define("clubsuit","\\clubsuit","&clubs;","[clubs]","[clubs]","♣");
define("spades","\\spadesuit","&spades;","[spades]","[spades]","♠");
define("spadesuit","\\spadesuit","&spades;","[spades]","[spades]","♠");
define("hearts","\\heartsuit","&hearts;","[hearts]","[hearts]","♥");
define("heartsuit","\\heartsuit","&heartsuit;","[hearts]","[hearts]","♥");
define("diams","\\diamondsuit","&diams;","[diamonds]","[diamonds]","♦");
define("diamondsuit","\\diamondsuit","&diams;","[diamonds]","[diamonds]","♦");
define("Diamond","\\diamond","&diamond;","[diamond]","[diamond]","⋄");
define("loz","\\diamond","&loz;","[lozenge]","[lozenge]","◊");

module.exports = exports = Entity;