
function contractor() {
  var val = false;
  if ($('a[href="/find-work-home/"]').size() > 0) {
    var val = true;
  }
  return val;
}

function loadTemplates() {
  var cache           = $('<div style="display:none;"></div>').attr('id','templates'),
      templateAddress = chrome.extension.getURL('templates/templates.html');

  cache.load(templateAddress,function () { cache.appendTo('body'); });
}

function loadScript(url, callback) {
  if ($('script[src="' + url + '"]').size() < 1) {
    var script = $('<script src="' + url +'"></script>')
    $('head').append(script);
  }
}

function loadCSS(url) { var css = $('<link href="' + chrome.extension.getURL('css/' + url) + '" rel="stylesheet" type="text/css">'); $('head').append(css); }

function scriptInject() {
  
  
  if (contractor()) {
    loadScript(chrome.extension.getURL('js/job-search/filter-panel.js'));
    loadScript(chrome.extension.getURL('js/job-search/processing.js'));
    loadScript(chrome.extension.getURL('js/job-search/search-area.js'));
    loadScript(chrome.extension.getURL('js/my_jobs.js'));
    loadScript(chrome.extension.getURL('js/inbox/inbox.js'));
    loadScript(chrome.extension.getURL('js/job-search/job-applications.js'));
    /*loadScript(chrome.extension.getURL('js/job-application.js'));*/
  }
  loadScript(chrome.extension.getURL('js/css_inject.js'));
  loadScript(chrome.extension.getURL('js/scaffolding.js'));
  loadScript(chrome.extension.getURL('js/plex_template.js'));
  if (!contractor()){ loadScript(chrome.extension.getURL('js/provider-messaging.js')); }
}

loadCSS('oDesk_Styles.css');
loadCSS('header.css');

scriptInject();
loadTemplates();