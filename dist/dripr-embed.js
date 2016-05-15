(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Dripr = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "baseUrl": "https://dripr.io",
  "baseAPIUrl": "https://api.dripr.io"
}

},{}],2:[function(require,module,exports){
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

},{"./config":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanNvbiIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcImJhc2VVcmxcIjogXCJodHRwczovL2RyaXByLmlvXCIsXG4gIFwiYmFzZUFQSVVybFwiOiBcImh0dHBzOi8vYXBpLmRyaXByLmlvXCJcbn1cbiIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG52YXIgRHJpcHIgPSBmdW5jdGlvbiAoKSB7XG5cbn1cbkRyaXByLmNhY2hlQ3NzID0ge307XG5Ecmlwci5yZW5kZXJJbWFnZSA9IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIHN0clZhcj0gJzxkaXYgY2xhc3M9XCJjYXJkXCIgc3R5bGU9XCJ3aWR0aDogJyArIChvcHRpb25zLndpZHRoID8gb3B0aW9ucy53aWR0aCA6ICc0MDBweCcpICsnXCI+ICdcbisgJyAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIiBzdHlsZT1cImhlaWdodDogJyArIChvcHRpb25zLmhlaWdodCA/IG9wdGlvbnMuaGVpZ2h0IDogJzMwMHB4JykgKyAnXCI+ICdcbisgJyAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlcl9fYXZhdGFyXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJnF1b3Q7JyArIGRhdGEudXJsICsgJyZxdW90Oyk7XCI+PC9kaXY+PGEgaHJlZj1cIicgKyBjb25maWcuYmFzZVVybCArICcvZmlsZS8nICsgZGF0YS5oYXNoICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiY2FyZC1oZWFkZXJfX2ZvbGxvd1wiPk1vcmU8L2E+ICdcbisgJyAgICA8L2Rpdj4gJztcbmlmKGZhbHNlKSB7XG4gIHN0clZhciArPSAnJ1xuICArICcgICAgPGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPiAnXG4gICsgJyAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRfX3VzZXJuYW1lXCI+R29uY2FsbyBNYXJnYWxobzwvZGl2PiAnXG4gICsgJyAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWNvbnRlbnRfX2Jpb1wiPkRlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gRGVzY3Jpb3B0aW9uIERlc2NyaW9wdGlvbiBEZXNjcmlvcHRpb24gLjwvZGl2PiAnXG4gICsgJyAgICA8L2Rpdj4gJztcbn1cblxuc3RyVmFyICs9ICcnXG4rICcgICAgPGRpdiBjbGFzcz1cImNhcmQtZm9vdGVyXCI+ICdcbisgJyAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fcGVuc1wiPiA8c3Bhbj4wPC9zcGFuPiAnXG4rICcgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPkZvbGxvd2VyczwvZGl2PiAnXG4rICcgICAgICA8L2Rpdj4gJ1xuKyAnICAgICAgPGRpdiBjbGFzcz1cImNhcmQtZm9vdGVyX19mb2xsb3dlcnNcIj4gPHNwYW4+JyArIGRhdGEudmlld3MgKyAnPC9zcGFuPiAnXG4rICcgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlZpZXdzPC9kaXY+ICdcbisgJyAgICAgIDwvZGl2PiAnXG4rICcgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJfX2ZvbGxvd2luZ1wiPiA8c3Bhbj4nICsgZGF0YS5jb21tZW50cyArICc8L3NwYW4+ICdcbisgJyAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+Q29tbWVudHM8L2Rpdj4gJ1xuKyAnICAgICAgPC9kaXY+ICdcbisgJyAgICA8L2Rpdj4gJ1xuKyAnICA8L2Rpdj4gJztcblxuICBEcmlwci5yZW5kZXJXaWRnZXQoc3RyVmFyLCBvcHRpb25zKTtcbn1cblxuRHJpcHIucmVuZGVyQ29kZSA9IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcbiAgRHJpcHIucmVxdWVzdFN0eWxlc2hlZXQoJy4vY3NzL2NvZGUuY3NzJyk7XG5cbiAgdmFyIHN0clZhciA9ICc8c2VjdGlvbiBjbGFzcz1cImNvZGUtZWRpdG9yXCI+J1xuICAgICAgKyAnPGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+PHNwYW4+PGEgaHJlZj1cIicgKyBjb25maWcuYmFzZVVybCArICcvZmlsZS8nICsgZGF0YS5oYXNoICsgJ1wiPnRlc3QuanM8L2E+IGhvc3RlZCB3aXRoIDwzIGJ5IDxhIGhyZWY9XCInICsgY29uZmlnLmJhc2VVcmwgKyAnXCI+RHJpcHIuaW88L2E+PC9zcGFuPidcbiAgICAgICsgJyA8L2Rpdj4nXG4gICAgICArICc8cHJlIGNsYXNzPVwibGluZS1udW1iZXJzXCI+JyArIFwiXFxuXCJcbiAgICAgICsgJzxjb2RlIGlkPVwiZHJpcHJfY29kZV8nICsgb3B0aW9ucy51bmlxdWVOYW1lICsgJ1wiIGNsYXNzPVwibGFuZ3VhZ2UtJyArIGRhdGEubGFuZ3VhZ2UgKyAnXCI+JyArIFwiXFxuXCJcbiAgICAgICsgZGF0YS50ZXh0XG4gICAgICArICc8L2NvZGU+J1xuICAgICAgKyAnPC9wcmU+J1xuICAgICAgKyAnPC9zZWN0aW9uPic7XG5cblxuICBEcmlwci5yZW5kZXJXaWRnZXQoc3RyVmFyLCBvcHRpb25zKTtcbiAgaWYgKHR5cGVvZiBQcmlzbSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBEcmlwci5yZXF1ZXN0Q29udGVudCgnLi9qcy9jb2RlLmpzJywgZnVuY3Rpb24oZSkge1xuICAgICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJpcHJfY29kZV8nICsgb3B0aW9ucy51bmlxdWVOYW1lKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJpcHJfY29kZV8nICsgb3B0aW9ucy51bmlxdWVOYW1lKSk7XG4gIH1cblxufVxuRHJpcHIucmVuZGVyID0gZnVuY3Rpb24oZGF0YSwgb3B0aW9ucykge1xuICBzd2l0Y2goZGF0YS50eXBlKSB7XG4gICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgRHJpcHIucmVuZGVySW1hZ2UoZGF0YSwgb3B0aW9ucyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjb2RlJzpcbiAgICAgIERyaXByLnJlbmRlckNvZGUoZGF0YSwgb3B0aW9ucyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgRHJpcHIucmVuZGVyTm90Rm91bmQoZGF0YSwgb3B0aW9ucyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5Ecmlwci5yZW5kZXJXaWRnZXQgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghdGV4dCkgeyByZXR1cm47IH1cbiAgdmFyIGRpdjtcbiAgaWYoIW9wdGlvbnMuZWxlbWVudCkge1xuICAgIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMudW5pcXVlTmFtZSk7XG4gIH0gZWxzZSBpZih0eXBlb2Ygb3B0aW9ucy5lbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgIGRpdiA9IG9wdGlvbnMuZWxlbWVudDtcbiAgfSBlbHNlIGlmKHR5cGVvZiBvcHRpb25zLmVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucylcbiAgICBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLnVuaXF1ZU5hbWUpXG4gIH1cblxuICBkaXYuaW5uZXJIVE1MID0gZGl2LmlubmVySFRNTCArIHRleHQ7ICAvLyBhc3NpZ24gbmV3IEhUTUwgaW50byAjUk9PVFxuICBkaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IC8vIG1ha2UgZWxlbWVudCB2aXNpYmxlXG4gIGRpdi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnOyAvLyBtYWtlIGVsZW1lbnQgdmlzaWJsZVxufVxuRHJpcHIucmVxdWVzdENvbnRlbnQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgaWYoY2FsbGJhY2spIHtcbiAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChlKSB7IGNhbGxiYWNrKGUpOyB9LCBmYWxzZSk7XG4gIH1cblxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG5Ecmlwci5yZXF1ZXN0U3R5bGVzaGVldCA9IGZ1bmN0aW9uKHN0eWxlc2hlZXRfdXJsKSB7XG4gIGlmKERyaXByLmNhY2hlQ3NzW3N0eWxlc2hlZXRfdXJsXSkgcmV0dXJuO1xuXG4gICAgdmFyIHN0eWxlc2hlZXQsIG5vZGU7XG4gICAgc3R5bGVzaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICAgIHN0eWxlc2hlZXQucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4gICAgc3R5bGVzaGVldC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHN0eWxlc2hlZXQuaHJlZiA9IHN0eWxlc2hlZXRfdXJsO1xuICAgIHN0eWxlc2hlZXQubWVkaWEgPSBcImFsbFwiO1xuICAgIG5vZGUgPSBkb2N1bWVudC5sYXN0Q2hpbGQ7XG4gICAgd2hpbGUgKG5vZGUubm9kZVR5cGUgIT09IDEpIHsgbm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nOyB9XG4gICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAobm9kZS5ub2RlVHlwZSAhPT0gMSkgeyBub2RlID0gbm9kZS5uZXh0U2libGluZzsgfVxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3R5bGVzaGVldCk7XG4gICAgRHJpcHIuY2FjaGVDc3Nbc3R5bGVzaGVldF91cmxdID0gc3R5bGVzaGVldF91cmw7XG4gIH1cblxuRHJpcHIucmVuZGVyRmlsZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgRHJpcHIucmVxdWVzdFN0eWxlc2hlZXQoY29uZmlnLmJhc2VBUElVcmwgKyAnL2FzZC5jc3MnKTtcbiAgaWYoIW9wdGlvbnMuZWxlbWVudCkgZG9jdW1lbnQud3JpdGUoXCI8ZGl2IGNsYXNzPSdkcmlwcl9lbWJlZCcgaWQ9J1wiICsgb3B0aW9ucy51bmlxdWVOYW1lICsgXCInIHN0eWxlPSdkaXNwbGF5OiBub25lJz48L2Rpdj5cIik7XG4gIERyaXByLnJlcXVlc3RDb250ZW50KERyaXByLmdlbmVyYXRlRmlsZVVybChvcHRpb25zLmZpbGVJZCwgb3B0aW9ucy51bmlxdWVOYW1lKSk7XG4gIHZhciBub19zY3JpcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9fc2NyaXB0Jyk7XG4gIGlmIChub19zY3JpcHQpIHsgbm9fc2NyaXB0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7IH1cbn1cblxuRHJpcHIuZ2VuZXJhdGVGaWxlVXJsID0gZnVuY3Rpb24oaGFzaCwgY2FsbGJhY2tOYW1lKSB7XG4gIHJldHVybiBjb25maWcuYmFzZUFQSVVybCArICcvZmlsZXMvJyArIGhhc2ggKyAnP2NhbGxiYWNrPURyaXByLicgKyBjYWxsYmFja05hbWU7XG59XG5cbkRyaXByLmZpbGUgPSBmdW5jdGlvbihmaWxlSWQsIG9wdGlvbnMpIHtcbiAgaWYoIW9wdGlvbnMpIHsgb3B0aW9ucyA9IHt9OyB9XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgb3B0aW9ucy5maWxlSWQgPSBmaWxlSWQ7XG4gIG9wdGlvbnMudW5pcXVlTmFtZSA9IG9wdGlvbnMudW5pcXVlTmFtZSB8fCAoJ2EnICsgZmlsZUlkICsgZC5nZXRUaW1lKCkudG9TdHJpbmcoKSk7XG5cbiAgdGhpc1tvcHRpb25zLnVuaXF1ZU5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIERyaXByLnJlbmRlcihkYXRhLCBvcHRpb25zKVxuICB9XG5cbiAgRHJpcHIucmVuZGVyRmlsZShvcHRpb25zKVxuXG59XG5Ecmlwci5maWxlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGZpbGVJZCwgb3B0aW9ucykge1xuICBpZighb3B0aW9ucykgeyBvcHRpb25zID0ge307IH1cbiAgb3B0aW9ucyA9IHtlbGVtZW50OiBlbGVtZW50fTtcbiAgaWYoZWxlbWVudCAhPT0gbnVsbCAmJiB0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcpIHtcbiAgIG9wdGlvbnMudW5pcXVlTmFtZSA9IGVsZW1lbnQuaWQ7XG4gfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgb3B0aW9ucy51bmlxdWVOYW1lID0gZWxlbWVudDtcbiB9XG4gIERyaXByLmZpbGUoZmlsZUlkLCBvcHRpb25zKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRHJpcHI7XG4iXX0=
