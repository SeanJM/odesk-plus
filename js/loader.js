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
      'dingo',
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
        regexp,
        tagel;

    var exe = function (arr,i) {
      url    = chrome.extension.getURL(options.type+'/'+arr[i]+'.'+options.type);
      tag    = options.tag.replace(/%url/g,url);
      regexp = new RegExp(tag);
      tagEl  = $(tag);
      if (!$('head').html().match(regexp)) {
        $('head').append(tagEl);
      }
      if (typeof arr[i+1] === 'string') {
        tagEl.ready(exe(arr,i+1));
      } else {
        if (typeof callback === 'function') {
          callback();
        }
      }
    }
    exe(options.files,0);
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