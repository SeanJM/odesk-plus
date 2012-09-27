/* Determine Account Type */
function account() {
  var val = 'provider';
  if ($('a[href="/find-work-home/"]').size() > 0) {
    var val = 'contractor';
  }
  return val;
}
function loadScript(url, callback) {
  if ($('script[src="' + url + '"]').size() < 1) {
    var script = $('<script src="' + url +'"></script>')
    $('head').append(script);
  }
}
//loadScript('http://code.jquery.com/jquery-latest.min.js');
if (account() == 'contractor') {
  loadScript(chrome.extension.getURL('js/job-search/filter-panel.js'));
  loadScript(chrome.extension.getURL('js/job-search/processing.js'));
  loadScript(chrome.extension.getURL('js/job-search/search-area.js'));
  loadScript(chrome.extension.getURL('js/my_jobs.js'));
  /*loadScript(chrome.extension.getURL('js/job-application.js'));*/
}
if (account() == 'provider'){
  loadScript(chrome.extension.getURL('js/provider-messaging.js'));
}
loadScript(chrome.extension.getURL('js/css_inject.js'));
/*loadScript(chrome.extension.getURL('js/header.js'));*/
function loadCSS(url) { var css = $('<link href="' + chrome.extension.getURL('css/' + url) + '" rel="stylesheet" type="text/css">'); $('head').append(css); }
loadCSS('oDesk_Styles.css');
loadCSS('header.css');