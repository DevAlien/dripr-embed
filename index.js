var config = require('./config');

var Dripr = function () {

}
Dripr.cacheCss = {};
Dripr.renderImage = function(data, options) {
  var strVar= '<div class="card" style="width: ' + (options.width ? options.width : '400px') +'"> '
+ '    <div class="card-header" style="height: ' + (options.height ? options.height : '300px') + '"> '
+ '      <div class="card-header__avatar" style="background-image: url(&quot;' + data.url + '&quot;);"></div><a href="' + config.baseUrl + '/file/' + data.hash + '" target="_blank" class="card-header__follow">More</a> '
+ '    </div> ';
if(false) {
  strVar += ''
  + '    <div class="card-content"> '
  + '      <div class="card-content__username">Goncalo Margalho</div> '
  + '      <div class="card-content__bio">Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption Descrioption .</div> '
  + '    </div> ';
}

strVar += ''
+ '    <div class="card-footer"> '
+ '      <div class="card-footer__pens"> <span>0</span> '
+ '        <div class="label">Followers</div> '
+ '      </div> '
+ '      <div class="card-footer__followers"> <span>' + data.views + '</span> '
+ '        <div class="label">Views</div> '
+ '      </div> '
+ '      <div class="card-footer__following"> <span>' + data.comments + '</span> '
+ '        <div class="label">Comments</div> '
+ '      </div> '
+ '    </div> '
+ '  </div> ';

  Dripr.renderWidget(strVar, options);
}

Dripr.renderCode = function(data, options) {
  Dripr.requestStylesheet('./css/code.css');

  var strVar = '<section class="code-editor">'
      + '<div class="controls"><span><a href="' + config.baseUrl + '/file/' + data.hash + '">test.js</a> hosted with <3 by <a href="' + config.baseUrl + '">Dripr.io</a></span>'
      + ' </div>'
      + '<pre class="line-numbers">' + "\n"
      + '<code id="dripr_code_' + options.uniqueName + '" class="language-' + data.language + '">' + "\n"
      + data.text
      + '</code>'
      + '</pre>'
      + '</section>';


  Dripr.renderWidget(strVar, options);
  if (typeof Prism === 'undefined') {
    Dripr.requestContent('./js/code.js', function(e) {
      Prism.highlightElement(document.getElementById('dripr_code_' + options.uniqueName));
    });
  } else {
    Prism.highlightElement(document.getElementById('dripr_code_' + options.uniqueName));
  }

}
Dripr.render = function(data, options) {
  switch(data.type) {
    case 'image':
      Dripr.renderImage(data, options);
      break;
    case 'code':
      Dripr.renderCode(data, options);
      break;
    default:
      Dripr.renderNotFound(data, options);
      break;
  }
}

Dripr.renderWidget = function(text, options) {
  if (!text) { return; }
  var div;
  if(!options.element) {
    div = document.getElementById(options.uniqueName);
  } else if(typeof options.element === 'object') {
    div = options.element;
  } else if(typeof options.element === 'string') {
    console.log(options)
    div = document.getElementById(options.uniqueName)
  }

  div.innerHTML = div.innerHTML + text;  // assign new HTML into #ROOT
  div.style.display = 'block'; // make element visible
  div.style.visibility = 'visible'; // make element visible
}
Dripr.requestContent = function(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  if(callback) {
    script.addEventListener('load', function (e) { callback(e); }, false);
  }

  document.getElementsByTagName('head')[0].appendChild(script);
}
Dripr.requestStylesheet = function(stylesheet_url) {
  if(Dripr.cacheCss[stylesheet_url]) return;

    var stylesheet, node;
    stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.type = "text/css";
    stylesheet.href = stylesheet_url;
    stylesheet.media = "all";
    node = document.lastChild;
    while (node.nodeType !== 1) { node = node.previousSibling; }
    node = node.firstChild;
    while (node.nodeType !== 1) { node = node.nextSibling; }
    node.appendChild(stylesheet);
    Dripr.cacheCss[stylesheet_url] = stylesheet_url;
  }

Dripr.renderFile = function(options) {
  Dripr.requestStylesheet(config.baseAPIUrl + '/asd.css');
  if(!options.element) document.write("<div class='dripr_embed' id='" + options.uniqueName + "' style='display: none'></div>");
  Dripr.requestContent(Dripr.generateFileUrl(options.fileId, options.uniqueName));
  var no_script = document.getElementById('no_script');
  if (no_script) { no_script.style.display = 'none'; }
}

Dripr.generateFileUrl = function(hash, callbackName) {
  return config.baseAPIUrl + '/files/' + hash + '?callback=Dripr.' + callbackName;
}

Dripr.file = function(fileId, options) {
  if(!options) { options = {}; }
  var d = new Date();
  options.fileId = fileId;
  options.uniqueName = options.uniqueName || ('a' + fileId + d.getTime().toString());

  this[options.uniqueName] = function(data) {
    Dripr.render(data, options)
  }

  Dripr.renderFile(options)

}
Dripr.fileElement = function(element, fileId, options) {
  if(!options) { options = {}; }
  options = {element: element};
  if(element !== null && typeof element === 'object') {
   options.uniqueName = element.id;
 } else if(typeof element === 'string') {
   options.uniqueName = element;
 }
  Dripr.file(fileId, options);
}
module.exports = Dripr;
