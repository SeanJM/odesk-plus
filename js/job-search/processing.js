var process = {};
process.check = function () {
  var checkProcess = setInterval(function(){ 
    if ($('div.oMain form.oFilterBar').hasClass('oLockOverlay') && !$('body').hasClass('process')) { 
      $('body').addClass('process');
      process.start();
    } 

    if (!$('div.oMain form.oFilterBar').hasClass('oLockOverlay') && $('body').hasClass('process')) { 
      $('body').removeClass('process');
      process.over();
      $('body').addClass('process-over');
    }
  },30);
}

process.start = function () {

}

process.over = function () {
  jobSearchInit();
}
process.validate = function () {
  setTimeout(function() {
    if (!$('body').hasClass('process') || !$('body').hasClass('process-over')) {
      jobSearchInit();
    }
  },300);
}

$(function(){
  process.check();
  process.validate();
});