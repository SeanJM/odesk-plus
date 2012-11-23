var process = {};
process.check = function () {
  var checkProcess = setInterval(function(){ 
    if ($('div.oMain form.oFilterBar').hasClass('oLockOverlay') && !$('body').hasClass('process')) { 
      $('body').addClass('process');
    } 

    if (!$('div.oMain form.oFilterBar').hasClass('oLockOverlay') && $('body').hasClass('process')) { 
      $('body').removeClass('process');
      $('body').addClass('process-over');
      jobSearchInit();
    }
  },30);
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