var dir = function () { $('html').attr('directory',chrome.extension.getURL('')); }

function contractor() {
  var val = false;
  if ($('a[href="/find-work-home/"]').size() > 0) {
    var val = true;
  }
  return val;
}

function loadScript(url, callback) {
  if ($('script[src="' + url + '"]').size() < 1) {
    var script = $('<script src="' + url +'"></script>')
    $('head').append(script);
  }
  console.log('* Loaded Script: ' + url);
}

function loadCSS(url) { var css = $('<link href="' + chrome.extension.getURL('css/' + url) + '" rel="stylesheet" type="text/css">'); $('head').append(css); }

function scriptInject() {
  
  
  if (contractor()) {
    /*loadScript(chrome.extension.getURL('js/job-application.js'));*/
  }
  loadScript(chrome.extension.getURL('js/template.js'));
  loadScript(chrome.extension.getURL('js/apply.js'));
  loadScript(chrome.extension.getURL('js/reports.js'));
  loadScript(chrome.extension.getURL('js/joey.js'));
  loadScript(chrome.extension.getURL('js/job-search/job-applications.js'));
  loadScript(chrome.extension.getURL('js/odesk-plus.js'));
}

$(function(){
  loadCSS('oDesk_Styles.css');
  loadCSS('header.css');
  dir();
  scriptInject();
});