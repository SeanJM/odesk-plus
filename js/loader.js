/* ======================================================= */
/* Chrome Directory ====================================== */
/* ======================================================= */

var setDir = function () {
  $('html').attr('directory',chrome.extension.getURL(''));
}

/* ======================================================= */
/* Loader ================================================ */
/* ======================================================= */

var load = {
  css: function (callback) {
    load.init({type: 'css',tag: '<link href="%url" rel="stylesheet" type="text/css">',files: [
      'styles'
    ]},callback);
  },
  javascript: function (callback) {
    load.init({type: 'js',tag: '<script src="%url"></script>',files: [
      'header',
      'db',
      'isPage',
      'job_apply',
      'init'
    ]},callback);
  },
  init: function (options,callback) {
    var url,
        tag,
        regexp;
    for (var i=0;i<options.files.length;i++) {
      url    = chrome.extension.getURL(options.type+'/'+options.files[i]+'.'+options.type);
      tag    = options.tag.replace(/%url/g,url);
      regexp = new RegExp(tag);
      if (!$('head').html().match(regexp)) {
        $('head').append($(tag));
      }
    }
    if (typeof callback === 'function') {
      callback();
    }
  }
}

/* ======================================================= */
/* Scripts =============================================== */
/* ======================================================= */

$(function(){
  setDir();
  load.css();
  load.javascript();
});